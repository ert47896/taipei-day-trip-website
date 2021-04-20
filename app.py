from flask import Flask, render_template, request, jsonify
from common.accessMysql import selectData, selectById

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False			#False避免中文顯示為ASCII編碼
app.config["TEMPLATES_AUTO_RELOAD"]=True	#True當flask偵測到template有修改會自動更新
app.config["JSON_SORT_KEYS"]=False			#False不以物件名稱進行排序顯示

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.route("/api/attractions")
def dataWithPage():
	eachPage = 12	#每頁12筆資料
	page = int(request.args.get("page"))
	keyword = request.args.get("keyword")
	returnData = selectData(eachPage, page, keyword)
	if "error" in returnData:
		return jsonify(returnData), 500
	else:
		return jsonify(
			{
				"nextPage":page+1,
				"data":returnData
			}
		), 200

@app.route("/api/attraction/<int:attractionId>")
def dataWithId(attractionId):
	returnData = selectById(attractionId)
	if "error" in returnData:
		if returnData["message"] == "伺服器錯誤":
			return jsonify(returnData), 500
		else:
			return jsonify(returnData), 400
	else:
		return jsonify(
			{
				"data":returnData
			}
		), 200

app.run(port=3000)