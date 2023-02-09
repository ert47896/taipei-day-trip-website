import json
from mysql.connector import connect
import os
from dotenv import load_dotenv
load_dotenv()

userdb=connect(
    host="mysqldb",
    user=os.getenv("db_user"),
    password=os.getenv("db_password"),
    database="taipeitrip"
)

with open("/workspace/flask/app/data/taipei-attractions.json", "r", encoding="utf-8") as input:
    data = json.load(input)
    spotData = data["result"]["results"]
    with userdb.cursor() as cursor:
        for each_spot in spotData:
            allUrl = each_spot["file"].split("http://")
            allUrl.pop(0)
            urlList = []
            for url in allUrl:
                if url[-3:] == "jpg" or url[-3:] == "png" or url[-3:] == "JPG":
                    urlList.append("http://"+url)
            jsonList = json.dumps(urlList)
            sqlQuery = "INSERT INTO spot (name, category, description, address, transport, mrt, latitude, longitude, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
            value = (each_spot["stitle"], each_spot["CAT2"], each_spot["xbody"], each_spot["address"].replace(" ",""), each_spot["info"], each_spot["MRT"], each_spot["latitude"], each_spot["longitude"], jsonList)
            cursor.execute(sqlQuery, value)
            userdb.commit()
            #stitle就是name CAT2就是category xbody就是description address就是address
            #info就是transport MRT就是mrt latitued就是latitude longitude就是longitude

    
