# [Taipei Trip](https://trip.taipeilife.site/) 旅遊電商網站

This website is built with the Taipei City tourist attractions from [Taipei Open Data Platform](https://data.taipei/#/dataset/detail?id=bd31c976-d3a5-4eed-b8c3-7454bc266afa).
Features include:
* Browse and Search attractions on the homepage
* Membership system for sign up / sign in
* Shopping cart system for booking the attraction guide
* Integrate TapPay SDK for providing online payment service

## Demo
Taipei Trip website：https://trip.taipeilife.site/<br>

#### For sign in
Test Account：test@test.com (or sign up new user)<br>
Test Password：test

#### For payment verification
Credit Card：4242 4242 4242 4242<br>
Date：01/24<br>
CVV：123

## Skills
* Created with Python Flask
* Used MVC design pattern in Python and Javascript
* Combined Nginx, Flask, MySQL and Let's Encrypt(auto renew SSL certification) with Docker Compose for rapid deployment
* Built RESTful style API
* Used MySQL for storing data and applied Index & Foreign key
* Integrate Third-party payment: TapPay SDK
* Used HTML and CSS to accomplish RWD

## System Architecture Diagrame
![image](https://user-images.githubusercontent.com/24973056/128726778-92dcdc79-4562-4d25-83ea-9f28456b28f8.png)

## MySQL Database Scheam
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
