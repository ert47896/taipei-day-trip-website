let imageNumberNow=0;
let imageNumberTotal=0;
window.addEventListener("load", init(window.location.pathname));
function init(id){
    let src=window.location.origin+"/api"+id;
    fetch(src).then((response)=>{
        return response.json();
    }).then((result)=>{
        showData(result.data);
    })
}
function showData(data){
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
    imageNumberTotal=data.images.length;
    data.images.forEach((image, index)=>{
        let imageNode=document.createElement("img");
        imageNode.src=image;
        imageNode.classList.add("transparent");
        buttonLeftsibling.insertAdjacentElement("beforebegin", imageNode);
        let circleNode=document.createElement("button");
        circleNode.classList.add("circlePhotoFalse");
        photoNumberCircle.appendChild(circleNode);
    })
    imageRenew(imageNumberNow, imageNumberTotal);
}
let timeIntervalRadio=document.getElementsByName("timeInterval");
timeIntervalRadio.forEach((radio)=>{
    radio.addEventListener("click", function(){
        let oldCostText=document.getElementById("costAmount");
        oldCostText.remove();
        let costLabel=document.getElementById("costTitle");
        let costText=document.createElement("div");
        costText.classList.add("labelText");
        costText.id = "costAmount";
        if (this.value==="morning"){                //this就是radio物件
            costText.textContent="新台幣 2000 元";
        }else{
            costText.textContent="新台幣 2500 元";
        }
        costLabel.insertAdjacentElement("afterend", costText);
    })
})
//將日期預設為當日
document.getElementById("date").valueAsDate=new Date();
//左滑按鈕
let leftbtn=document.getElementById("buttonSwipeLeft");
leftbtn.addEventListener("click", function(){
    imageNumberNow -= 1;
    imagePassed();
    imageRenew(imageNumberNow, imageNumberTotal);
})
//右滑按鈕
let rightbtn=document.getElementById("buttonSwipeRight");
rightbtn.addEventListener("click", function(){
    imageNumberNow += 1;
    imagePassed();
    imageRenew(imageNumberNow, imageNumberTotal);
})
function imageRenew(indexNow, total){
    const index=((indexNow % total)+total) % total;
    const imageNode=document.querySelectorAll(".transparent")[index];
    const circleNode=document.querySelectorAll(".circlePhotoFalse")[index];
    imageNode.classList.remove("transparent");
    circleNode.classList.remove("circlePhotoFalse");
    imageNode.classList.add("opaque");
    circleNode.classList.add("circlePhotoTrue");
}
function imagePassed(){
    const imageNode=document.querySelector(".opaque");
    const circleNode=document.querySelector(".circlePhotoTrue");
    imageNode.classList.remove("opaque");
    circleNode.classList.remove("circlePhotoTrue");
    imageNode.classList.add("transparent");
    circleNode.classList.add("circlePhotoFalse");
}