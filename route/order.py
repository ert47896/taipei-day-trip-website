from flask import request, make_response
from flask_restful import Resource
from module.bookingMysql import deletePreData
from module.userMysql import checkUserStatus
from module.orderMysql import submitorderingData, submitpaymentData, submitresponseData, updateStatus, getOrderData
from module.checkdata import checkOrderData
from random import randint
import requests
import json
import os
from dotenv import load_dotenv
load_dotenv()

class ordersApi(Resource):
    def post(self):
        cookieValue = request.cookies.get("sessionId")
        # 檢查使用者是否有cookie，正常回復(True, (user_id, name, email), 查詢當下再延長的expendTime)
        checkResult = checkUserStatus(cookieValue)
        userId = checkResult[1][0]
        expendTime = checkResult[2]
        if checkResult == False:
            return {"error":"true", "message":"未登入系統，拒絕存取"}, 403
        # request.get_json()取得post過來的資料
        orderData = request.get_json()
        primeValue = orderData["prime"]
        attractionId = orderData["order"]["trip"]["id"]
        orderPrice = orderData["order"]["price"]
        orderDate = orderData["order"]["date"]
        orderTime = orderData["order"]["time"]
        name = orderData["contact"]["name"]
        email = orderData["contact"]["email"]
        phone = orderData["contact"]["phone"]
        # 檢查使用者提供資料正確性
        checkDataResult = checkOrderData(primeValue, attractionId, orderPrice, orderDate, orderTime, name, email, phone)
        if checkDataResult == False:
            return {"error":"true", "message":"建立失敗，輸入資料錯誤"}, 400
        # 建立訂單編號和資料，付款狀態為未付款(payment_status=1)
        insertResult = submitorderingData(userId, attractionId, orderDate, orderTime, orderPrice, name, email, phone, payment_status=1)
        if "error" in insertResult:
            # 回傳伺服器內部錯誤訊息
            return insertResult
        # 獲得orderSerialNumber(當下日期+8碼整數)，亦為銀行端訂單編號
        bank_transaction_id = insertResult
        # POST TapPay API 完成付款動作
        # 1.將request部分資料存到payment_query table，並刪除booking table資料
        merchantId = os.getenv("merchantId")
        tappayNumber = randint(0,999)
        detail = "Taipei Trip"
        insertResult = submitpaymentData(bank_transaction_id, merchantId, orderPrice, tappayNumber, detail)
        if "error" in insertResult:
            # 回傳伺服器內部錯誤訊息
            return insertResult
        # 刪除booking table資料
        deleteResult = deletePreData(userId)
        if "error" in deleteResult:
            # 回傳伺服器內部錯誤訊息            
            return deleteResult
        # 2.建立requestData
        requestData = json.dumps({
            "prime":primeValue,
            "partner_key":os.getenv("tappay_key"),
            "merchant_id":merchantId,
            "amount":orderPrice,
            #TapPay識別，可重複
            "order_number":tappayNumber,
            #銀行端訂單編號
            "bank_transaction_id":bank_transaction_id,
            "details":detail,
            "cardholder":{
                "phone_number":"+886"+phone[1:],
                "name":name,
                "email":email
            }
        })
        requestHeader = {
            "Content-Type":"application/json",
            "x-api-key":os.getenv("tappay_key")
        }
        apiurl = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        response = requests.post(url=apiurl, headers=requestHeader, data=requestData)
        response = response.json()
        # 3.將tap pay API回復部分資料存到payment_response table
        insertResult = submitresponseData(response)
        if "error" in insertResult:
            # 回傳伺服器內部錯誤訊息
            return insertResult
        # 4.tap pay API回復交易成功，修改ordering table該筆訂單為已付款(payment_status=0)
        if response["status"] == 0:
            updateResult = updateStatus(response["status"] ,bank_transaction_id)
            if "error" in updateResult:
                # 回傳伺服器內部錯誤訊息
                return updateResult
        # 5.回復API資料給前端
        message = "付款失敗"
        if response["status"] == 0:
            message = "付款成功"
        responseData={
            "data":{
                "number":bank_transaction_id,
                "payment":{
                    "status":response["status"],
                    "message":message
                }
            }
        }
        resp = make_response(responseData, 200)
        resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
        return resp
        
class orderApi(Resource):
    def get(self, orderNumber):
        cookieValue = request.cookies.get("sessionId")
        # 檢查使用者是否有cookie，正常回復(True, (user_id, name, email), 查詢當下再延長的expendTime)
        checkResult = checkUserStatus(cookieValue)
        expendTime = checkResult[2]
        if checkResult == False:
            return {"error":"true", "message":"未登入系統，拒絕存取"}, 403
        # 取得該訂單資料
        result = getOrderData(orderNumber)
        if "error" in result:
            # 回傳伺服器內部錯誤訊息
            return result
        resp = make_response(result, 200)
        resp.set_cookie(key="sessionId", value=cookieValue, expires=expendTime)
        return resp
