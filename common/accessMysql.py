from mysql.connector import connect
from getpass import getpass
import sys

userdb=connect(
    host="localhost",
    user=sys.argv[1],
    password=sys.argv[2],
    database="stage2"
)

def selectData(pageNum, pageInp, keyWord):	#供"/api/attractions"使用
	if keyWord:								#pageNum=12 pageInp=user input number(start from 0)
		inputQuery = "SELECT a.* FROM (SELECT id FROM spot WHERE name LIKE %s ORDER BY id LIMIT %s, %s) b JOIN spot a ON a.id = b.id"
		inputValue = (("%"+keyWord+"%"), pageNum*pageInp, pageNum+1)
	else:
		inputQuery = "SELECT a.* FROM (SELECT id FROM spot ORDER BY id LIMIT %s, %s) b JOIN spot a ON a.id = b.id"
		inputValue = (pageNum*pageInp, pageNum+1)
	allResult = sqlSelect(inputQuery, inputValue)
	allResultNum = len(allResult)
	if allResultNum - pageNum > 0:
		return allResult[:-1], pageInp+1
	else:
		return allResult, None

def selectById(spotId):					#供"/api/attraction/<int:attractionId>"使用
	inputQuery = "SELECT * FROM spot WHERE id = %s"
	inputValue = (spotId, )
	result = sqlSelect(inputQuery, inputValue)
	if result:
		return result
	else:
		return {"error":True, "message":"景點編號不正確"}

def sqlSelect(sqlQuery, value):
	try:
		with userdb.cursor() as cursor:
			cursor.execute(sqlQuery, value)
			sqlresult = cursor.fetchall()
		responseData = []
		for result in sqlresult:
			dictData = {}
			dictData["id"] = result[0]
			dictData["name"] = result[1]
			dictData["category"] = result[2]
			dictData["description"] = result[3]
			dictData["address"] = result[4]
			dictData["transport"] = result[5]
			dictData["mrt"] = result[6]				
			dictData["latitude"] = float(result[7])
			dictData["longitude"] = float(result[8])
			eachUrl = result[9].split(",")
			eachUrl.pop()
			dictData["images"] = []
			for singleUrl in eachUrl:
				dictData["images"].append(singleUrl)
			responseData.append(dictData)
		return responseData
	except:
		return {"error":True, "message":"伺服器錯誤"}