from module.connectMysql import connection_pool
import secrets
import time
from hashlib import sha256

cookieLiveTime = 20 * 60

def checkSignUp(email, password, name):
    inputQuery = "SELECT id FROM user WHERE email = %s"
    inputValue = (email, )
    result = sqlSelect(inputQuery, inputValue)
    if result == None:
        insertQuery = "INSERT INTO user (name, email, password) VALUES (%s, %s, %s)"
        insertValue = (name, email, password)
        return signUp(insertQuery, insertValue)
    elif "error" in result:
        return result
    else:
        return {"error":"true", "message":"Email重複註冊！"}

def checkSignIn(email, password):
    inputQuery = "SELECT id FROM user WHERE email = %s AND password = %s"
    inputValue = (email, password)
    result = sqlSelect(inputQuery, inputValue)
    if result == None:
        return {"error":"ture", "message":"電子郵件或密碼錯誤！"}
    elif "error" in result:
        return result
    else:
        additionString = secrets.token_hex(16)
        cookieValue = cookieValue=sha256((email + additionString).encode("utf-8")).hexdigest()
        cookieExpireTime = time.time() + cookieLiveTime
        updateQuery = "UPDATE user SET sessionid = %s, session_expiretime = %s WHERE id = %s"
        updateValue = (cookieValue, cookieExpireTime, result[0])
        updateResult = updateCookie(updateQuery, updateValue)
        return (updateResult, cookieValue, cookieExpireTime)

def searchExpire(cookieId):
    inputQuery = "SELECT id, name, email, session_expiretime FROM user WHERE sessionid = %s"
    inputValue = (cookieId, )
    result = sqlSelect(inputQuery, inputValue)
    return result

def changeExpire(cookieId):
    changeQuery = "UPDATE user SET session_expiretime = %s WHERE sessionid = %s"
    changeValue = (0, cookieId)
    changeResult = updateCookie(changeQuery, changeValue)
    return (changeResult, 0)

def sqlSelect(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            sqlresult = cursor.fetchone()
        connection_object.close()
        return sqlresult
    except:
        return {"error":"true", "message":"伺服器內部錯誤！"}

def signUp(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":"true"}
    except:
        return {"error":"true", "message":"伺服器內部錯誤！"}

def cookieExtend(cookieId):
    newexpireTime = time.time() + cookieLiveTime
    updateQuery = "UPDATE user SET session_expiretime = %s WHERE sessionid = %s"
    updateValue = (newexpireTime, cookieId)
    updateCookie(updateQuery, updateValue)
    return newexpireTime

def updateCookie(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":"true"}
    except:
        return {"error":"true", "message":"伺服器內部錯誤！"}
    
