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
* 以 Python Flask 框架建立網站
* 應用 HTML + CSS 完成 RWD 網頁
* 採 MVC 架構編寫後端 Python 與前端 Javascript
* 使用 MySQL 儲存景點、會員與訂單資訊
* 設定 index 及 foreign key 於 MySQL 資料庫
* 串接 TayPay 第三方金流
* 採 RESTful 架構設計網站 API
* 部署網站於 AWS EC2 並運用 Nginx 反向代理
* SSL 憑證實踐 HTTPS

## 系統架構圖
![image](https://user-images.githubusercontent.com/24973056/128726778-92dcdc79-4562-4d25-83ea-9f28456b28f8.png)

## MySQL 資料庫架構圖
![image](https://user-images.githubusercontent.com/24973056/128726139-5cae936a-d98f-42e5-b133-8aad9d911aa6.png)

## 網站導覽
### 首頁
1. 應用無限捲軸供使用者滑動滾輪瀏覽接續12筆景點
2. 提供關鍵字搜尋景點名稱

![image](https://user-images.githubusercontent.com/24973056/128669442-446e70f8-5754-45c9-a316-838d04f1975f.png)

### 會員系統
使用者帳號註冊、登入

![image](https://user-images.githubusercontent.com/24973056/128671516-337594a0-204d-4f8b-9672-3f6e9d7ff7be.png)

### 景點頁面
詳細介紹個別景點資訊並提供預訂導覽行程服務

![image](https://user-images.githubusercontent.com/24973056/128672205-7d83d823-f08f-4daa-85ad-de0c8b96065f.png)

### 預定行程頁面
供使用者填寫聯絡資訊與信用卡付款資訊，亦可點選刪除圖示取消此筆預定導覽行程

![image](https://user-images.githubusercontent.com/24973056/128672908-09b94ae8-2c15-4115-92b5-31aa401a6993.png)

### 付款完成頁面
顯示該筆訂單行程資訊及付款狀態

![image](https://user-images.githubusercontent.com/24973056/128674101-a9ab6c32-54fc-4bd7-a8a1-570b872f095a.png)
