// Models
let models={
    // 顯示資料頁數預設為第一頁(index 0)
    pageNum:0,
    // 搜尋關鍵字
    keywordInput:null,
    // api回復資料
    data:null,
    // 向api索取景點資料
    getData:function(pages, keyword=null){
        controllers.loadStatusNone=false;       // 更新AJAX讀取狀態為執行中(=false)
        console.log(controllers.loadStatusNone);
        let src="http://35.72.125.150:3000/api/attractions?page="+pages;
        if(keyword){
            src += ("&keyword="+keyword);
        }
        return fetch(src).then((response)=>{
            return response.json();
        }).then((result)=>{
            this.data=result.data;
            this.pageNum=result.nextPage;
            console.log(this.pageNum);
        });
    }
};
// Views
let views={
    // 顯示景點資料
    renderData:function(data){
        for(i=0;i<data.length;i++){
            let textResult=document.querySelector(".noData");       //如果前一次查詢無資料，先把"查無資料"文字刪除再呈現景點資訊
            if(textResult){
                textResult.remove();
            };
            let parent=document.querySelector(".mainContainer");
            let oneContainer=document.createElement("div");
            oneContainer.classList.add("oneContainer");
            const firstUrl=data[i].images[0];
            let image=document.createElement("img");
            image.src=firstUrl;
            let attraction=document.createElement("div");
            attraction.classList.add("attraction");
            let title=document.createElement("div");
            title.classList.add("title");
            title.textContent=data[i].name;
            let subtitle=document.createElement("div");
            subtitle.classList.add("subtitle");
            let subLeft=document.createElement("div");
            subLeft.classList.add("subLeft");
            subLeft.textContent=data[i].mrt;
            let subRight=document.createElement("div");
            subRight.classList.add("subRight");
            subRight.textContent=data[i].category;
            let hyperLink=document.createElement("a");
            hyperLink.href="/attraction/"+data[i].id;
            let spanLink=document.createElement("span");
            spanLink.classList.add("spanLink");
            hyperLink.appendChild(spanLink);
            subtitle.appendChild(subLeft);
            subtitle.appendChild(subRight);
            attraction.appendChild(title);
            attraction.appendChild(subtitle);
            oneContainer.appendChild(image);
            oneContainer.appendChild(attraction);
            oneContainer.appendChild(hyperLink);
            parent.appendChild(oneContainer);
        }
        controllers.loadStatusNone=true;    // 該階段畫面呈現完成，更新AJAX讀取狀態為未執行(=true)
    },
    // 顯示無資料
    renderNoneData:function(){
        let parent=document.querySelector(".mainContainer");
        parent.innerHTML="";
        let title=document.createElement("div");
        title.classList.add("noData");
        title.textContent="查無資料。";
        parent.appendChild(title);
    }
};
// Controllers
let controllers={
    // AJAX讀取狀態
    loadStatusNone:false,
    // 初始化函式 呈現景點資料並啟動物件監聽
    init:function(){
        models.getData(models.pageNum).then(()=>{
            views.renderData(models.data);
        }).then(()=>{
            this.searchButtonListener();
            this.scrollLoadListener();
        });
    },
    // 監聽使用者點擊搜尋
    searchButtonListener:function(){
        let searchBtn=document.getElementById("searchBtn");
        searchBtn.addEventListener("click", function(){
            models.keywordInput=document.getElementById("keyword").value;
            models.pageNum=0;
            models.getData(models.pageNum, models.keywordInput).then(()=>{
                if(models.data.length){
                    views.renderData(models.data);
                }else{
                    views.renderNoneData();
                };
            });
        });
    },
    // 監聽無限卷軸做動
    // 偵測Y軸滑動位置接續載入圖片，當Y軸滑動距離 > (整個頁面高度-使用者畫面高度) * 0.75 且尚無執行AJAX讀取資訊並有下一頁，執行fetch方法
    // 向API取完資料再呈現畫面
    scrollLoadListener:function(){
        window.addEventListener("scroll", function(){
            if(window.scrollY > (document.documentElement.scrollHeight-window.innerHeight)*0.75 && controllers.loadStatusNone && models.pageNum){
                models.getData(models.pageNum, models.keywordInput).then(()=>{
                    views.renderData(models.data);
                });
            };
        });
    }
};
controllers.init();     //載入頁面初始化並啟動物件監聽