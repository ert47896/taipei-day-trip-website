from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from common.accessMysql import selectData, selectById

app=Flask(__name__, static_folder="public", static_url_path="/")
CORS(app)									#設定所有的domains and routes接受跨來源資源共用(CORS)
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
	if type(returnData) is dict:
		return jsonify(returnData), 500
	else:
		return jsonify(
			{
				"nextPage":returnData[1],
				"data":returnData[0]
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

app.run(host="0.0.0.0", port=3000)