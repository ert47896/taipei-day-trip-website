// Models
let models={
    data:null,
    // 向attraction API索取該id景點資料
    attractionApi:function(urlId){
        let src=window.location.origin+"/api"+urlId;   //window.location.origin 伺服器主機網址
        return fetch(src).then((response)=>{
            return response.json();
        }).then((result)=>{
            this.data=result.data;
        });
    }
};
// Views
let views={
    // 所呈現圖片序號
    imageNumberNow:0,
    // 景點總圖片數
    imageNumberTotal:0,
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
    // 依據使用者選擇顯示價格
    changePrice:function(timeSection){
        let oldCostText=document.getElementById("costAmount");
        oldCostText.remove();
        let costLabel=document.getElementById("costTitle");
        let costText=document.createElement("div");
        costText.classList.add("labelText");
        costText.id="costAmount";
        if (timeSection==="morning"){
            costText.textContent="新台幣 2000 元";
        }else{
            costText.textContent="新台幣 2500 元";
        };
        costLabel.insertAdjacentElement("afterend", costText);
    }
};
// Controllers
let controllers={
    // 初始化函式 呈現景點資料與圖片及圓點位置後 啟動物件監聽(日期 圖片左右 登入/註冊 sign面板部分)
    init:function(){
        models.attractionApi(window.location.pathname).then(()=>{
            views.renderData(models.data);
            views.imageRenew(views.imageNumberNow, views.imageNumberTotal);
        }).then(()=>{
            this.timeIntervalListener();
            this.leftButtonListener();
            this.rightButtonListener();
        });
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
    }
};
controllers.init();     //載入頁面初始化並啟動物件監聽