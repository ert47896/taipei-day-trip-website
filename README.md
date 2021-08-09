# [台北一日遊](https://taipeilife.info/) 旅遊電商網站

本網站依據[台北旅遊網景點資料](https://data.taipei/#/dataset/detail?id=bd31c976-d3a5-4eed-b8c3-7454bc266afa)建置，功能包括：
* 首頁瀏覽、搜尋景點
* 會員系統註冊、登入
* 個別景點獨立分頁介紹
* 串接TapPay金流付款供線上預訂導覽行程

## Demo
台北一日遊網站：https://taipeilife.info/<br>
測試帳號：test@test.com (或自行註冊)<br>
密碼：1234

Credit Card：4242 4242 4242 4242<br>
Date：01/23<br>
CVV：123

## 使用技術
* Python Flask
* 以HTML + CSS完成RWD網頁
* 採MVC架構編寫Javascript
* 使用MySQL儲存景點與使用者資訊
* 串接TayPay金流
* 採RESTful架構設計網站API
* 部署網站於AWS EC2並運用nginx反向代理
* SSL憑證實踐HTTPS

## 網站導覽
### 首頁
1. 應用無限捲軸供使用者滑動滾輪瀏覽接續12筆景點
2. 提供關鍵字搜尋景點名稱

![image](https://user-images.githubusercontent.com/24973056/128669442-446e70f8-5754-45c9-a316-838d04f1975f.png)

3. 首頁RWD

![image](https://user-images.githubusercontent.com/24973056/128669448-7d1b6d2e-62ec-4dd6-b3f6-b881c46f1c47.png)

### 會員系統
使用者帳號註冊、登入

![image](https://user-images.githubusercontent.com/24973056/128671516-337594a0-204d-4f8b-9672-3f6e9d7ff7be.png)

### 景點頁面
1. 此頁面詳細介紹個別景點資訊並提供預訂導覽行程服務

![image](https://user-images.githubusercontent.com/24973056/128672205-7d83d823-f08f-4daa-85ad-de0c8b96065f.png)

2. 景點頁面RWD

![image](https://user-images.githubusercontent.com/24973056/128672208-9c343b20-8a93-4d54-9a07-bc02030d2c39.png)

### 預定行程頁面
1. 供使用者填寫聯絡資訊與信用卡付款資訊，亦可點選刪除圖示取消此筆預定導覽行程

![image](https://user-images.githubusercontent.com/24973056/128672908-09b94ae8-2c15-4115-92b5-31aa401a6993.png)

2. 預定行程頁面RWD

![image](https://user-images.githubusercontent.com/24973056/128672911-a3805ae0-5d2d-40f9-8d6c-e676f4a895b5.png)

### 付款完成頁面
1. 顯示該筆訂單行程資訊及付款狀態

![image](https://user-images.githubusercontent.com/24973056/128674101-a9ab6c32-54fc-4bd7-a8a1-570b872f095a.png)

2. 付款完成頁面RWD

![image](https://user-images.githubusercontent.com/24973056/128674106-d89150de-4717-4c8f-806f-b00b0486a2cf.png)
