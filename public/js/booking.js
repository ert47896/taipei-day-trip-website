// Models
let bookingmodels={
    data:null,
    // 存放api回復狀態碼
    responseStatus:0,
    // 以fetch對user API發送請求
    // 向API索取資料
    getAPIData:function(useMethod, srcUrl, reqData=null){
        let reqSet={};
        if (useMethod==="GET"){
            reqSet={
                method:useMethod
            };
        }else{
            reqSet={
                method:useMethod,
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(reqData)
            };
        };
        return fetch(srcUrl, reqSet).then((response)=>{
            this.responseStatus=response.status;
            return response.json();
        }).then((result)=>{
            this.data=result;
        });
    }
}
// Views
let bookingviews={
    // userData (id, name, email)
    // attractionData (attraction(id, name, address, image), date, time, price)
    renderData:function(userData, attractionData){
        const bodyDOM=document.querySelector("body");
        bodyDOM.classList.add("bodySign");
        // 標題姓名
        const welcomeTitle=document.querySelector(".welcomeTitle span");
        welcomeTitle.textContent=userData["name"];
        // 圖片
        const imageDOM=document.querySelector(".image");
        imageDOM.src=attractionData["attraction"]["image"];
        // 景點名稱
        const titleDOM=document.querySelector(".title span");
        titleDOM.textContent=attractionData["attraction"]["name"];
        // 日期 時間 費用 地點
        const subtitleDOM=document.querySelectorAll(".subTitleContent");
        subtitleDOM[0].textContent=attractionData["date"];
        if (attractionData["time"]==="morning"){
            subtitleDOM[1].textContent="早上 9 點到下午 4 點";
        }else{
            subtitleDOM[1].textContent="下午 2 點到晚上 9 點";
        }
        subtitleDOM[2].textContent=attractionData["price"];
        subtitleDOM[3].textContent=attractionData["attraction"]["address"];
        // 聯絡姓名 聯絡信箱
        const nameDOM=document.querySelector("input[name='userName']");
        nameDOM.value=userData["name"];
        const emailDOM=document.querySelector("input[name='userEmail']");
        emailDOM.value=userData["email"];
    },
    renderNullData:function(userData){
        const contentDOM=document.querySelector(".attractionProfile");
        contentDOM.innerHTML="";
        const formDOM=document.querySelector("form");
        formDOM.innerHTML="";
        // 姓名
        const welcomeTitle=document.querySelector(".welcomeTitle span");
        welcomeTitle.textContent=userData["name"];
        // 無資料所顯示內容
        const parentDOM=document.querySelector(".mainSubContainer");
        const textDOM=document.createElement("div");
        textDOM.textContent="目前沒有任何待預定的行程";
        textDOM.classList.add("nullText");
        parentDOM.appendChild(textDOM);
        // 調整body的css設定，讓footer自動填滿畫面
        const bodyDOM=document.querySelector("body");
        bodyDOM.classList.add("bodyNoneData");
    },
    tappayView:function(){
        // TapPay內建輸入表單格式設定
        TPDirect.card.setup({
            fields: {
                number: {
                    // use css selector
                    element: ".form-control.card-number",
                    placeholder: "**** **** **** ****"
                },
                expirationDate: {
                    element: ".form-control.expiration-date",
                    placeholder: "MM / YY"
                },
                ccv: {
                    element: ".form-control.ccv",
                    placeholder:"CVV"
                }
            },
            styles: {
                // 設定付款input
                "input": {
                    "font-family": "Noto Sans TC",
                    "font-size": "16px"
                },
                // 輸入時字變黑色
                ":focus": {
                    "color": "black"
                },
                // 數值符合規範變綠色
                ".valid": {
                    "color": "green"
                },
                // 數值不符合規範變紅色
                ".invalid": {
                    "color": "red"
                }
            }
        });
    }
}
// Controllers
let bookingcontrollers={
    // 使用者資料
    userData:null,
    // 預定行程資料
    bookingData:null,
    // request body
    orderFormData:{},
    // 初始化
    init:function(){
        this.loadCheckSign();
        this.deleteBtn();
        this.tappayinit();
        this.submitBtn();
    },
    // 確認使用者是否已登入
    loadCheckSign:function(){
        let src=window.location.origin+"/api/user";   //window.location.origin 伺服器主機網址
        bookingmodels.getAPIData("GET", src).then(()=>{
            if (bookingmodels.data.data==="null"){
                // 未登入導向首頁
                window.location.assign(window.location.origin);
            }else{
                // 已登入，儲存使用者資料
                this.userData=bookingmodels.data.data;
                // 向booking API讀取資料
                bookingcontrollers.getBookingData();
            };
        });
    },
    getBookingData:function(){
        let src=window.location.origin+"/api/booking";  //window.location.origin 伺服器主機網址
        bookingmodels.getAPIData("GET", src).then(()=>{
            if (bookingmodels.responseStatus===200){
                // 讀取資料成功，儲存訂單資料
                this.bookingData=bookingmodels.data.data;
                // 將資料呈現(null 或 有訂單)
                if (this.bookingData === "null"){
                    bookingviews.renderNullData(this.userData);
                }else{
                    bookingviews.renderData(this.userData, this.bookingData);
                };
            }else{
                // 資料輸入失敗，頁面呈現錯誤訊息
                const bodyDOM=document.querySelector("body");
                bodyDOM.innerHTML="";
                bodyDOM.textContent=models.data.message;
            };
        });
    },
    deleteBtn:function(){
        const deleteBtn=document.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", function(){
            let src=window.location.origin+"/api/booking";  //window.location.origin 伺服器主機網址
            bookingmodels.getAPIData("DELETE", src).then(()=>{
                if (bookingmodels.responseStatus===200){
                    location.reload();
                }else{
                    // 資料輸入失敗，頁面呈現錯誤訊息
                    const bodyDOM=document.querySelector("body");
                    bodyDOM.innerHTML="";
                    bodyDOM.textContent=models.data.message;
                };
            });
        });
    },
    tappayinit:function(){
        // 設置金鑰
        TPDirect.setupSDK(20417, "app_TTWnXjREbHPvX0fyCvYBSfvD4P6tmGBIZGOMTUNTy6vt4855sEziPbFP1s5s", "sandbox");
        bookingviews.tappayView();
        TPDirect.card.onUpdate(function(update){
            const submitButton=document.querySelector(".paymentBtn");
            // 付款欄位數值都符合規範，[確認訂購並付款]才給點擊
            if (update.canGetPrime){
                // Enable submit Button to get prime.
                submitButton.removeAttribute("disabled");
            }else{
                // Disable submit Button to get prime.
                submitButton.setAttribute("disabled", true);
            };
        })
    },
    submitBtn:function(){
        const submitForm=document.querySelector(".formContainer");
        submitForm.addEventListener("submit", function(event){
            event.preventDefault();
            // Get prime
            TPDirect.card.getPrime((result)=>{
                if (result.status !== 0){
                    alert("交易失敗，請重新確認付款資訊！");
                    return
                };
                // 獲得prime value，製作request body
                bookingcontrollers.orderFormData["prime"]=result.card.prime;
                // 宣告一個FormData集合 用來存放form中的訂購行程資料(userName userEmail userPhone)
                // 亦可用getElementById逐一撈出來
                const formData=new FormData(submitForm);
                bookingcontrollers.orderFormData["order"]={};
                bookingcontrollers.orderFormData["contact"]={};
                bookingcontrollers.orderFormData["order"]["price"]=bookingcontrollers.bookingData["price"];
                bookingcontrollers.orderFormData["order"]["trip"]=bookingcontrollers.bookingData["attraction"];
                bookingcontrollers.orderFormData["order"]["date"]=bookingcontrollers.bookingData["date"];
                bookingcontrollers.orderFormData["order"]["time"]=bookingcontrollers.bookingData["time"];
                bookingcontrollers.orderFormData["contact"]["name"]=formData.get("userName");
                bookingcontrollers.orderFormData["contact"]["email"]=formData.get("userEmail");
                bookingcontrollers.orderFormData["contact"]["phone"]=formData.get("userPhone");
                bookingcontrollers.orderDataAction();
            });
        });
    },
    // POST oders API
    orderDataAction:function(){
        const src=window.location.origin+"/api/orders";   //window.location.origin 伺服器主機網址
        bookingmodels.getAPIData("POST", src, bookingcontrollers.orderFormData).then(()=>{
            if (models.responseStatus===200){
                // 資料輸入成功，接收付款結果，導向thankyou頁面
                // window.location.assign(window.location.origin+"/booking");
            }else{
                // 資料輸入失敗，頁面呈現錯誤訊息
                const bodyDOM=document.querySelector("body");
                bodyDOM.innerHTML="";
                bodyDOM.textContent=models.data.message;
            };
        })
    }

}
bookingcontrollers.init();