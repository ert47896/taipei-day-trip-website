// Models
let models={
    data:null,
    // 存放api回復狀態碼
    responseStatus:0,
    // 以fetch對user API發送請求
    getAPIData:function(srcUrl){
        return fetch(srcUrl).then((response)=>{
            this.responseStatus=response.status;
            return response.json();
        }).then((result)=>{
            this.data=result;
        });
    }
}
// Views
let views={
    // userData (id, name, email)
    // orderingData (number, trip(attraction(id, name, address, image)), date, time, price, contact(name, email, phone), status)
    renderData:function(userData, orderingData){
        const bodyDOM=document.querySelector("body");
        bodyDOM.classList.add("bodySign");
        // 標題姓名
        const welcomeTitle=document.querySelector(".welcomeTitle span");
        welcomeTitle.textContent=userData["name"];
        // 圖片
        const imageDOM=document.querySelector(".image");
        imageDOM.src=orderingData["trip"]["attraction"]["image"];
        // 景點名稱
        const titleDOM=document.querySelector(".title span");
        titleDOM.textContent=orderingData["trip"]["attraction"]["name"];
        // 日期 時間 費用 地點
        const subtitleDOM=document.querySelectorAll(".profile .subTitleContent");
        subtitleDOM[0].textContent=orderingData["date"];
        if (orderingData["time"]==="morning"){
            subtitleDOM[1].textContent="早上 9 點到下午 4 點";
        }else{
            subtitleDOM[1].textContent="下午 2 點到晚上 9 點";
        }
        subtitleDOM[2].textContent=orderingData["price"];
        subtitleDOM[3].textContent=orderingData["trip"]["attraction"]["address"];
        // 訂單編號 付款狀態 姓名 信箱 手機
        const orderDOM=document.querySelectorAll(".contactContainer .subTitleContent");
        orderDOM[0].textContent=orderingData["number"];
        if (orderingData["status"]===0){
            orderDOM[1].textContent="已完成付款";
        }else if (orderingData["status"]===10003){
            orderDOM[1].textContent="付款未完成，信用卡資料錯誤";
        }else if (orderingData["status"]===10005){
            orderDOM[1].textContent="付款未完成，銀行端系統錯誤";
        }else{
            orderDOM[1].textContent="付款未完成，系統內部錯誤，請聯繫服務窗口(02)-12341234";
        };
        orderDOM[2].textContent=orderingData["contact"]["name"];
        orderDOM[3].textContent=orderingData["contact"]["email"];
        orderDOM[4].textContent=orderingData["contact"]["phone"];
    },
    renderNullData:function(userData){
        const contentDOM=document.querySelector(".attractionProfile");
        contentDOM.innerHTML="";
        const contactDOM=document.querySelector(".contactContainer");
        contactDOM.remove();
        // 姓名
        const welcomeTitle=document.querySelector(".welcomeTitle span");
        welcomeTitle.textContent=userData["name"];
        // 無資料所顯示內容
        const parentDOM=document.querySelector(".mainSubContainer");
        const textDOM=document.createElement("div");
        textDOM.textContent="目前尚無預定的行程資料";
        textDOM.classList.add("nullText");
        parentDOM.appendChild(textDOM);
        // 調整body的css設定，讓footer自動填滿畫面
        const bodyDOM=document.querySelector("body");
        bodyDOM.classList.add("bodyNoneData");
    },
    renderError:function(message){
        const bodyDOM=document.querySelector("body");
        bodyDOM.classList.add("bodySign");
        bodyDOM.innerHTML="";
        bodyDOM.textContent=message;
    }
}
// Controllers
let controllers={
    // 使用者資料
    userData:null,
    // 預定行程資料
    orderingData:null,
    // 確認使用者是否已登入
    loadCheckSign:function(){
        const src=window.location.origin+"/api/user";   //window.location.origin 伺服器主機網址
        models.getAPIData(src).then(()=>{
            if (models.data.data===null){
                // 未登入導向首頁
                window.location.assign(window.location.origin);
            }else{
                // 已登入，儲存使用者資料
                this.userData=models.data.data;
                // 向booking API讀取資料
                controllers.getOrderingData();
            };
        });
    },
    getOrderingData:function(){
        // 取得query string
        const params=(new URL(document.location)).searchParams;
        const orderNumber=params.get("number");
        const src=window.location.origin+"/api/order/"+orderNumber;  //window.location.origin 伺服器主機網址
        models.getAPIData(src).then(()=>{
            if (models.responseStatus===200){
                // 讀取資料成功，儲存訂單資料
                this.orderingData=models.data.data;
                // 將資料呈現(null 或 有訂單)
                if (this.orderingData === null){
                    views.renderNullData(this.userData);
                }else{
                    views.renderData(this.userData, this.orderingData);
                };
            }else{
                // 資料輸入失敗，頁面呈現錯誤訊息
                views.renderError(models.data.message);
            };
        });
    }
}
controllers.loadCheckSign();