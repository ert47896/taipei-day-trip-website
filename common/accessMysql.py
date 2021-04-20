from getpass import getpass
from mysql.connector import connect

userdb=connect(
    host="localhost",
    user=input("Enter username: "),
    password=getpass("Enter password: "),
    database="stage2"
)

#Find total row in tabel spot
with userdb.cursor() as cursor:
	sqlQuery = "SELECT COUNT(id) FROM spot"
	cursor.execute(sqlQuery)
	sqlresult = cursor.fetchone()
totalRow = sqlresult[0]

def selectData(pageNum, pageInp, keyWord):	#供"/api/attractions"使用
	if keyWord:
		inputQuery = "SELECT * FROM spot WHERE id BETWEEN %s AND %s AND name LIKE %s"
		inputValue = ((pageNum*pageInp)+1, pageNum*(pageInp+1), ("%"+keyWord+"%"))
	else:
		inputQuery = "SELECT * FROM spot WHERE id BETWEEN %s AND %s"
		inputValue = ((pageNum*pageInp)+1, pageNum*(pageInp+1))
	return sqlSelect(inputQuery, inputValue)

def selectById(spotId):					#供"/api/attraction/<int:attractionId>"使用
	if spotId < 1 or spotId > totalRow:
		return {"error":True, "message":"景點編號不正確"}
	inputQuery = "SELECT * FROM spot WHERE id = %s"
	inputValue = (spotId, )
	return sqlSelect(inputQuery, inputValue)

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