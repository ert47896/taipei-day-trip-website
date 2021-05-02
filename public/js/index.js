let pageNum=0;
let loadStatusNone=false;
let keywordInput=null;

// 進入畫面讀取圖片，執行完結束進入畫面監聽
window.onload=()=>{
    loadAttractions(pageNum);
    window.addEventListener("scroll", scrollLoad);  // 開始監聽Y軸滑動
}
// 偵測Y軸滑動位置接續載入圖片，當Y軸滑動距離 > (整個頁面高度-使用者畫面高度) * 0.75 且尚無執行AJAX讀取資訊，執行fetch方法
const scrollLoad=()=>{
    if(window.scrollY > (document.documentElement.scrollHeight-window.innerHeight)*0.75 && loadStatusNone){
        loadAttractions(pageNum, keywordInput);
        loadStatusNone=false;           // 更新AJAX讀取狀態為執行中(=false)
    }
};
// 設定搜尋按鈕被點擊後動作
let searchBtn=document.getElementById("searchBtn");
searchBtn.onclick=()=>{
    keywordInput=document.getElementById("keyword").value;
    pageNum=0;
    loadAttractions(pageNum, keywordInput);
    // 刪除當下呈現的景點資訊或「查無資料」文字資訊
    let originalAttractions=document.querySelectorAll(".oneContainer");
    if(originalAttractions.length){
        for(i=0;i<originalAttractions.length;i++){
            originalAttractions[i].remove();
        }
    }else{
        let textResult=document.querySelector(".noData");
        textResult.remove();
    }
    window.addEventListener("scroll", scrollLoad);      // 開始監聽Y軸滑動
}
// 以fetch方法執行AJAX向api讀取景點資訊
loadAttractions=(pages, keyword=null)=>{
    let src="http://35.72.125.150:3000/api/attractions?page="+pages;
    if(keyword){
        src += ("&keyword="+keyword);
    }
    fetch(src).then((response)=>{
        return response.json();
    }).then((result)=>{
        pageNum=result.nextPage;
        if(!pageNum){
            window.removeEventListener("scroll", scrollLoad);   // 無nextpage結束Y軸滑動監聽
        }
        if(result.data.length){
            showAttractions(result.data);
        }else{
            let parent=document.querySelector(".mainContainer");
            let title=document.createElement("div");
            title.classList.add("noData");
            title.textContent="查無資料。";
            parent.appendChild(title);
        }
    })
}
// 將api回傳景點資訊呈現在頁面，且更新AJAX讀取狀態為尚未執行(=true)
showAttractions=(data)=>{
    for(i=0;i<data.length;i++){
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
        subtitle.appendChild(subLeft);
        subtitle.appendChild(subRight);
        attraction.appendChild(title);
        attraction.appendChild(subtitle);
        oneContainer.appendChild(image);
        oneContainer.appendChild(attraction);
        parent.appendChild(oneContainer);
    }
    loadStatusNone=true;
}