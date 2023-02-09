from module.connectMysql import connection_pool
import secrets
import time
from hashlib import sha256
from werkzeug.security import check_password_hash, generate_password_hash

cookieLiveTime = 20 * 60

def checkSignUp(email, password, name):
    inputQuery = "SELECT user_id FROM user WHERE email = %s"
    inputValue = (email, )
    result = sqlSelect(inputQuery, inputValue)
    if result == None:
        insertQuery = "INSERT INTO user (name, email, password) VALUES (%s, %s, %s)"
        insertValue = (name, email, generate_password_hash(password))
        return signUp(insertQuery, insertValue)
    elif "error" in result:
        return result
    else:
        return {"error":True, "message":"Email重複註冊！"}

def checkSignIn(email, password):
    inputQuery = "SELECT user_id, password FROM user WHERE email = %s"
    inputValue = (email, )
    # Two results in Tuple, user_id and password
    passwordResult = sqlSelect(inputQuery, inputValue)
    # Account alive then check password
    if passwordResult:
        checkPassword = check_password_hash(passwordResult[1], password)
    if (passwordResult == None) or (checkPassword == False):
        return {"error":True, "message":"電子郵件或密碼錯誤！"}
    elif "error" in passwordResult:
        return passwordResult
    else:
        additionString = secrets.token_hex(16)
        cookieValue = cookieValue=sha256((email + additionString).encode("utf-8")).hexdigest()
        cookieExpireTime = time.time() + cookieLiveTime
        updateQuery = "UPDATE user SET sessionid = %s, session_expiretime = %s WHERE user_id = %s"
        updateValue = (cookieValue, cookieExpireTime, passwordResult[0])
        updateResult = updateCookie(updateQuery, updateValue)
        return (updateResult, cookieValue, cookieExpireTime)

def searchExpire(cookieId):
    inputQuery = "SELECT user_id, name, email, session_expiretime FROM user WHERE sessionid = %s"
    inputValue = (cookieId, )
    result = sqlSelect(inputQuery, inputValue)
    if result:
        return result
    else:
        return {"error":True, "message":"身分驗證錯誤！"}

def changeExpire(cookieId):
    changeQuery = "UPDATE user SET session_expiretime = %s WHERE sessionid = %s"
    changeValue = (0, cookieId)
    changeResult = updateCookie(changeQuery, changeValue)
    return (changeResult, 0)

def checkUserStatus(cookieId, signInStatus=False):
    if cookieId:
        # 正常回復(user_id, name, email, session_expiretime)
        searchResult = searchExpire(cookieId)
        if "error" in searchResult:
            return signInStatus
        else:
            if time.time() > searchResult[3]:
                return signInStatus
            else:
                # cookie通過確認且未超過期限，每換一個頁面cookie期限為當下時間+20分鐘
                expendTime = cookieExtend(cookieId)
                signInStatus=True
                return signInStatus, searchResult[:3], expendTime
    else:
        return signInStatus

def sqlSelect(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            sqlresult = cursor.fetchone()
        connection_object.close()
        return sqlresult
    except:
        return {"error":True, "message":"伺服器內部錯誤！"}

def signUp(sqlQuery, value):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery, value)
            connection_object.commit()
        connection_object.close()
        return {"ok":True}
    except:
        return {"error":True, "message":"伺服器內部錯誤！"}

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
        return {"ok":True}
    except:
        return {"error":True, "message":"伺服器內部錯誤！"}
    
