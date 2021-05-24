import re
from datetime import datetime, date

def checkData(email, password, name=None):
    nameRule=r"^\S{1,60}$"
    emailRule=r"@"
    passwordRule=r"^\S{4,16}$"
    if name == None:
        nameResult=True
    else:
        nameResult=re.fullmatch(nameRule, name)
    emailResult=re.search(emailRule, email)
    passwordResult=re.search(passwordRule, password)
    return ((nameResult != None) and (emailResult != None) and (passwordResult != None))

def checkBookingData(attractionId, bookingDate, bookingTime, bookingPrice):
    # 將日期由string格式轉為datetime格式
    bookingDate = datetime.strptime(bookingDate, "%Y-%m-%d")
    # 景點id是否為整數
    idResult = isinstance(attractionId, int)
    # 日期是否為日期
    dateResult = isinstance(bookingDate, date)
    # 時段是否為afternoon或morning
    timeResult = bookingTime in ("afternoon", "morning")
    # 價格是否為2000或2500
    priceResult = bookingPrice in (2000, 2500)
    if idResult and dateResult and timeResult and priceResult:
        return True
    else:
        return False