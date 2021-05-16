// Models
let usermodels={
    data:null,
    // 存放api回復狀態碼
    responseStatus:0,
    // 以fetch對user API發送請求
    getData:function(useMethod, data=null){
        let src=window.location.origin+"/api/user";   //window.location.origin 伺服器主機網址
        if (useMethod==="GET"){
            return fetch(src).then((response)=>{
                return response.json();
            }).then((result)=>{
                this.data=result;
            });
        }else{
            return fetch(src, {
                method:useMethod,
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            }).then((response)=>{
                this.responseStatus=response.status;
                return response.json();
            }).then((result)=>{
                this.data=result;
            });
        };        
    },
    // 驗證使用者在sign面板輸入資料，因sign in部分不需要user所以給預設值為false並於判斷時直接給正確
    checkSignData:function(email, password, user=false){
        // 驗證資料為非空白字元且小於60字元
        const userRule=/^\S{1,60}$/;
        let userResult=userRule.test(user);
        if(user===false){
            userResult=true;
        };
        // 驗證資料需包括符號@
        const emailRule=/@/;
        const emailResult=emailRule.test(email);
        // 驗證資料為非空白字元且大於4字元小於16字元
        const passwordRule=/^\S{4,16}$/;
        const passwordResult=passwordRule.test(password);
        return (userResult && emailResult && passwordResult);
    }
}
// Views
let userviews={
    // 給物件id顯示該物件，並放入文字(如有需要)
    showBlock:function(elementid, text=null){
        const showTargets=document.getElementById(elementid);
        if (text){
            showTargets.textContent=text;
        }
        showTargets.classList.add("showElement");
    },
    // 給物件id隱藏該物件
    hideBlock:function(elementid){
        const hideTargets=document.getElementById(elementid);
        hideTargets.classList.remove("showElement");
    }
}
// Controllers
let usercontrollers={
    // 初始化 啟動sign面板內所有按鈕的EventListener
    init:function(){
        this.loadAction();
        this.signListener();
        this.signInAction();
        this.toSignUpBlock();
        this.signUpAction();
        this.toSignInBlock();
        this.closeBlock();
        this.signOutAction();
    },
    // 監聽畫面載入確認使用者是否已登入
    loadAction:function(){
        window.addEventListener("load", function(){
            usermodels.getData("GET").then(()=>{
                if (usermodels.data.data==="null"){
                    //show 登入註冊 hide 登出帳號  
                    userviews.showBlock("getSignBlock");
                    userviews.hideBlock("getSignOut");
                }else{
                    //show 登出帳號 hide 登入註冊
                    userviews.showBlock("getSignOut");
                    userviews.hideBlock("getSignBlock");
                };
            });
        });
    },
    // 監聽使用者點擊[登入/註冊]按鈕顯示Sign In介面    
    signListener:function(){
        const getSignBlockBtn=document.getElementById("getSignBlock");
        getSignBlockBtn.addEventListener("click", function(){
            usercontrollers.showSignIn();
        });
    },
    // 向Api發送資料處理使用者登入驗證事宜
    signInAction:function(){
        const signInBtn=document.getElementById("signInBtn");
        signInBtn.addEventListener("click", function(e){
            // 檢查sign面板如有先前訊息執行隱藏
            usercontrollers.checkPreStatement("signInBlock");
            // 避免form預設發送http請求
            e.preventDefault();
            const form=document.getElementById("signInForm");
            // 宣告一個FormData集合 用來存放form中的註冊資料(email password)
            // 亦可用getElementById逐一撈出來
            const formData=new FormData(form);
            const email=formData.get("email");
            const password=formData.get("password");
            // 驗證使用者輸入資料(email, password)，如有不符顯示錯誤訊息並離開
            const checkResult=usermodels.checkSignData(email, password);
            if(checkResult===false){
                userviews.showBlock("signInError", "請檢查輸入資料內容且不得為空白！");
                return
            };
            data={
                "email":email,
                "password":password
            };
            // fetch後端API驗證資料
            usermodels.getData("PATCH", data).then(()=>{
                if (usermodels.responseStatus===200){
                    // 重新整理頁面(觸發"GET"驗證狀態)
                    location.reload();
                }else if(usermodels.responseStatus===400){
                    userviews.showBlock("signInError", usermodels.data.message);
                }else if(usermodels.responseStatus===500){
                    userviews.showBlock("signInError", usermodels.data.message);
                };
            })
        });        
    },
    // 隱藏sign in面板顯示sign up面板
    toSignUpBlock:function(){
        const toSignUp=document.getElementById("toSignUp");
        toSignUp.addEventListener("click", function(){
            usercontrollers.checkPreStatement("signUpBlock");
            usercontrollers.removePreValue("signUpBlock");
            userviews.hideBlock("signInBlock");
            userviews.showBlock("signUpBlock");
        });
    },
    // 向Api發送資料處理使用者註冊事宜
    signUpAction:function(){
        const signUpBtn=document.getElementById("signUpBtn");
        signUpBtn.addEventListener("click", function(event){
            // 檢查sign面板如有先前訊息執行隱藏
            usercontrollers.checkPreStatement("signUpBlock");
            // 避免form預設發送http請求
            event.preventDefault();
            const form=document.getElementById("signUpForm");
            // 宣告一個FormData集合 用來存放form中的註冊資料(nameSignUp emailSignUp passwordSignUp)
            // 亦可用getElementById逐一撈出來
            const formData=new FormData(form);
            const emailSignUp=formData.get("emailSignUp");
            const passwordSignUp=formData.get("passwordSignUp");
            const nameSignUp=formData.get("nameSignUp");
            // 驗證使用者輸入資料(email, password, name)，如有不符顯示錯誤訊息並離開
            const checkResult=usermodels.checkSignData(emailSignUp, passwordSignUp, nameSignUp);
            if(checkResult===false){
                userviews.showBlock("signUpError", "請檢查輸入資料內容且不得為空白！");
                return
            };
            data={
                "name":nameSignUp,
                "email":emailSignUp,
                "password":passwordSignUp
            };
            // fetch後端API註冊資料
            usermodels.getData("POST", data).then(()=>{
                if (usermodels.responseStatus===200){
                    userviews.showBlock("signUpSuccess", "註冊成功！");
                }else if(usermodels.responseStatus===400){
                    userviews.showBlock("signUpError", usermodels.data.message);
                }else if(usermodels.responseStatus===500){
                    userviews.showBlock("signUpError", usermodels.data.message);
                };
            });
        });
    },
    // 隱藏sign up面板顯示sign in面板
    toSignInBlock:function(){
        const toSignIn=document.getElementById("toSignIn");
        toSignIn.addEventListener("click", function(){
            usercontrollers.showSignIn();
        });
    },
    // 點擊[X]按鈕隱藏當下sign面板 (可能是sign in或sign up)
    closeBlock:function(){
        const closeBtns=document.querySelectorAll(".closeBtn");
        closeBtns.forEach((btn)=>{
            btn.addEventListener("click", function(){
                const blockNow=document.querySelector(".signBlock.showElement");
                blockNowId=blockNow.id;
                userviews.hideBlock(blockNowId);
            });
        });
    },
    // 向Api發送資料處理使用者登出事宜
    signOutAction:function(){
        const signOutBtn=document.getElementById("getSignOut");
        signOutBtn.addEventListener("click", function(){
            // fetch後端API更新使用者cookie
            usermodels.getData("DELETE").then(()=>{                
                location.reload();
            });
        });
    },
    // 配合[登入/註冊]按鈕也能使用
    showSignIn:function(){
        usercontrollers.checkPreStatement("signInBlock");
        usercontrollers.removePreValue("signInBlock");
        userviews.hideBlock("signUpBlock");
        userviews.showBlock("signInBlock");
    },
    // 檢查sign面板有無前次操作訊息，有則隱藏
    checkPreStatement:function(blockId){
        const signBlock=document.getElementById(blockId);
        const showDiv=signBlock.querySelector(".showElement");
        if(showDiv){
            userviews.hideBlock(showDiv.id);
        };
    },
    // 將sign面板form欄位初始化，避免殘留先前資料
    removePreValue:function(blockId){
        const signBlock=document.getElementById(blockId);
        const form=signBlock.querySelector("form");
        form.reset();
    }    
}
usercontrollers.init();     //載入頁面初始化並啟動物件監聽
