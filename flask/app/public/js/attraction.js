// Models
let models={
    data:null,
    // 存放api回復狀態碼
    responseStatus:0,
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
};
// Views
let views={
    // 所呈現圖片序號
    imageNumberNow:0,
    // 景點總圖片數
    imageNumberTotal:0,
    // 使用者選擇行程價格(預設2000元)
    tripPrice:2000,
    // 將該id景點資料填入頁面
    renderData:function(data){
        let siblingForm=document.querySelector("#orderForm");
        let title=document.createElement("div");
        title.classList.add("title");
        title.textContent=data.name;
        siblingForm.insertAdjacentElement("beforebegin", title);
        let subtitle=document.createElement("div");
        subtitle.classList.add("subTitle");
        subtitle.textContent=data.category+" at "+data.mrt;
        siblingForm.insertAdjacentElement("beforebegin", subtitle);
        let parentMain=document.querySelector("#details");
        let introduce=document.createElement("div");
        introduce.classList.add("info");
        introduce.textContent=data.description;
        parentMain.insertBefore(introduce, parentMain.firstChild);
        let addressTitle=document.getElementById("address");
        let address=document.createElement("div");
        address.classList.add("info");
        address.textContent=data.address;
        addressTitle.insertAdjacentElement("afterend", address);
        let transportTitle=document.getElementById("transport");
        let transport=document.createElement("div");
        transport.classList.add("info");
        transport.textContent=data.transport;
        transportTitle.insertAdjacentElement("afterend", transport);
        let buttonLeftsibling=document.getElementById("buttonSwipeLeft");
        let photoNumberCircle=document.querySelector(".photoNumberCircle");
        this.imageNumberTotal=data.images.length;
        data.images.forEach((image)=>{
            let imageNode=document.createElement("img");
            imageNode.src=image;
            imageNode.alt="Attraction";
            imageNode.classList.add("transparent");
            buttonLeftsibling.insertAdjacentElement("beforebegin", imageNode);
            let circleNode=document.createElement("button");
            circleNode.classList.add("circlePhotoFalse");
            photoNumberCircle.appendChild(circleNode);
        });
    },
    // 更新與景點圖片相關物件顯示
    imageRenew:function(indexNow, total){
        const index=((indexNow % total)+total) % total;             //To obtain a modulo in JavaScript, in place of a % n, use ((a % n ) + n ) % n
        const imageNode=document.querySelectorAll(".transparent")[index];
        const circleNode=document.querySelectorAll(".circlePhotoFalse")[index];
        imageNode.classList.remove("transparent");
        circleNode.classList.remove("circlePhotoFalse");
        imageNode.classList.add("opaque");
        circleNode.classList.add("circlePhotoTrue");
    },
    // 移除上一張圖片及小圓圈CSS設定
    imagePassed:function(){
        const imageNode=document.querySelector(".opaque");
        const circleNode=document.querySelector(".circlePhotoTrue");
        imageNode.classList.remove("opaque");
        circleNode.classList.remove("circlePhotoTrue");
        imageNode.classList.add("transparent");
        circleNode.classList.add("circlePhotoFalse");
    },
    // 依據使用者選擇顯示價格，並更新變數tripPrice數值
    changePrice:function(timeSection){
        let oldCostText=document.getElementById("costAmount");
        oldCostText.remove();
        let costLabel=document.getElementById("costTitle");
        let costText=document.createElement("div");
        costText.classList.add("labelText");
        costText.id="costAmount";
        if (timeSection==="morning"){
            this.tripPrice=2000;
            costText.textContent="新台幣 2000 元";
        }else{
            this.tripPrice=2500;
            costText.textContent="新台幣 2500 元";
        };
        costLabel.insertAdjacentElement("afterend", costText);
    }
};
// Controllers
let controllers={
    // 該景點頁面於資料庫中景點Id
    attractionId:null,
    // orderForm資料
    bookingFormData:{},
    // 初始化函式 呈現景點資料與圖片及圓點位置後 啟動物件監聽(日期 圖片左右 登入/註冊 sign面板部分)
    init:function(){
        let src=window.location.origin+"/api"+window.location.pathname;   //window.location.origin 伺服器主機網址, window.location.pathname 網頁子路徑
        models.getAPIData("GET", src).then(()=>{
            views.renderData(models.data.data);
            this.attractionId=models.data.data.id;
            views.imageRenew(views.imageNumberNow, views.imageNumberTotal);
        }).then(()=>{
            this.timeIntervalListener();
            this.leftButtonListener();
            this.rightButtonListener();
            this.submitDataListener();
        });
        // 設定日期選擇限制
        const today=new Date().toISOString().split("T")[0];
        document.getElementsByName("selectDate")[0].setAttribute("min", today);
    },
    // 監聽使用者選擇上午或下午顯示價格
    timeIntervalListener:function(){
        const timeIntervalRadio=document.getElementsByName("timeInterval");
        timeIntervalRadio.forEach((radio)=>{
            radio.addEventListener("click", function(){
                views.changePrice(radio.value);
            });
        });
    },
    // 監聽使用者點擊左滑按鈕
    leftButtonListener:function(){
        const leftbtn=document.getElementById("buttonSwipeLeft");
        leftbtn.addEventListener("click", function(){
            views.imageNumberNow -= 1;
            views.imagePassed();
            views.imageRenew(views.imageNumberNow, views.imageNumberTotal);
        });
    },
    // 監聽使用者點擊右滑按鈕
    rightButtonListener:function(){
        const rightbtn=document.getElementById("buttonSwipeRight");
        rightbtn.addEventListener("click", function(){
            views.imageNumberNow += 1;
            views.imagePassed();
            views.imageRenew(views.imageNumberNow, views.imageNumberTotal);
        });
    },
    // 監聽使用者送出預定行程資料
    submitDataListener:function(){
        const orderForm=document.getElementById("orderForm");
        orderForm.addEventListener("submit", function(event){
            // 避免form預設發送http請求
            event.preventDefault();
            // 宣告一個FormData集合 用來存放form中的預定行程資料(selectDate timeInterval)
            // 亦可用getElementById逐一撈出來
            const formData=new FormData(orderForm);
            controllers.bookingFormData["attractionId"]=controllers.attractionId;
            controllers.bookingFormData["date"]=formData.get("selectDate");
            controllers.bookingFormData["time"]=formData.get("timeInterval");
            controllers.bookingFormData["price"]=views.tripPrice;
            controllers.submitCheckUser();
        });
    },
    // 檢查使用者登入狀態(向user API確認)
    submitCheckUser:function(){
        const src=window.location.origin+"/api/user";   //window.location.origin 伺服器主機網址
        models.getAPIData("GET", src).then(()=>{
            if (models.data.data===null){
                // 使用user.js中function:showSignIn呈現登入面板，且是因點擊[開始預定行程]按鈕而彈出
                usercontrollers.signinPreSubmit=true;
                usercontrollers.showSignIn();
            }else{
                // 已登入，向booking API傳送行程資料
                controllers.submitDataAction();                
            };
        });
    },
    // 向booking API傳送資料
    submitDataAction:function(){
        const src=window.location.origin+"/api/booking";   //window.location.origin 伺服器主機網址
        models.getAPIData("POST", src, controllers.bookingFormData).then(()=>{
            if (models.responseStatus===200){
                // 資料輸入成功，導向booking頁面
                window.location.assign(window.location.origin+"/booking");
            }else{
                // 資料輸入失敗，頁面呈現錯誤訊息
                const bodyDOM=document.querySelector("body");
                bodyDOM.innerHTML="";
                bodyDOM.textContent=models.data.message;
            };
        });        
    }
};
controllers.init();     //載入頁面初始化並啟動物件監聽