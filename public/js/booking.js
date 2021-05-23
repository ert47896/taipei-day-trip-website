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
    }
}
// Controllers
let bookingcontrollers={
    // 初始化
    init:function(){
        this.loadCheckSign();
        this.deleteBtn();
    },
    // 確認使用者是否已登入
    loadCheckSign:function(){
        let src=window.location.origin+"/api/user";   //window.location.origin 伺服器主機網址
        bookingmodels.getAPIData("GET", src).then(()=>{
            if (bookingmodels.data.data==="null"){
                // 未登入導向首頁
                window.location.assign(window.location.origin);
            }else{
                // 已登入，向booking API讀取資料
                bookingcontrollers.getBookingData();
            };
        });
    },
    getBookingData:function(){
        let src=window.location.origin+"/api/booking";  //window.location.origin 伺服器主機網址
        // 儲存使用者資料
        const userData = bookingmodels.data.data;
        bookingmodels.getAPIData("GET", src).then(()=>{
            if (bookingmodels.responseStatus===200){
                // 讀取資料成功，將資料呈現(分null 訂單)
                if (bookingmodels.data.data === "null"){
                    bookingviews.renderNullData(userData);
                }else{
                    bookingviews.renderData(userData, bookingmodels.data.data);
                };
            }else{
                // 顯示API所回覆錯誤訊息
                alert(bookingmodels.data.message);
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
                    // 顯示API所回覆錯誤訊息
                    alert(bookingmodels.data.message);
                };
            });
        });
    }
}
bookingcontrollers.init();