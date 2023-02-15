# [Taipei Trip](https://trip.taipeilife.site/) 旅遊電商網站

This website is built with the Taipei City tourist attractions from [Taipei Open Data Platform](https://data.taipei/#/dataset/detail?id=bd31c976-d3a5-4eed-b8c3-7454bc266afa).
Features include:
* Browse and Search attractions on the homepage
* Membership system for sign up / sign in
* Shopping cart system for booking the attraction guide
* Integrate [TapPay SDK](https://docs.tappaysdk.com/tutorial/en/home.html#home) for providing online payment service

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
![Taipei Trip Architecture](https://user-images.githubusercontent.com/24973056/218961980-18063934-7d91-4f9e-94ff-65d840b73fe7.png)

## MySQL Database Scheam
![Trip_DB_ERdiagram](https://user-images.githubusercontent.com/24973056/218967800-01b617cf-d21b-419a-96d2-77acfda65220.png)

## Features
### Homepage
1. Applied infinite scroll to automatically load next 12 attractions data
2. Supported searching attractions by keywords

![image](https://user-images.githubusercontent.com/24973056/128669442-446e70f8-5754-45c9-a316-838d04f1975f.png)

### Membership System
User Sign Up / Sign In

![image](https://user-images.githubusercontent.com/24973056/128671516-337594a0-204d-4f8b-9672-3f6e9d7ff7be.png)

### The page of each attraction
Present information of that attraction and supply booking guide service

![image](https://user-images.githubusercontent.com/24973056/128672205-7d83d823-f08f-4daa-85ad-de0c8b96065f.png)

### The page of booking guide service
User needs to fill in personal and payment information for booking guide service.

![image](https://user-images.githubusercontent.com/24973056/128672908-09b94ae8-2c15-4115-92b5-31aa401a6993.png)

### Thank you page
Show the trip information and the payment status

![image](https://user-images.githubusercontent.com/24973056/128674101-a9ab6c32-54fc-4bd7-a8a1-570b872f095a.png)
