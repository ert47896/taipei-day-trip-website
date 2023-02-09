from connectMysql import connection_pool
import time

# Create tables
def createTable(sqlQuery):
    try:
        connection_object = connection_pool.get_connection()
        with connection_object.cursor() as cursor:
            cursor.execute(sqlQuery)
    except Exception as error:
        with open("errorinsql.txt", "a") as outfile:
            nowStruct = time.localtime(time.time())
            nowString = time.strftime("%a, %d %b %Y %H:%M:%S", nowStruct)
            errorStr = nowString + "\n" + error + "\n"
            outfile.writelines(errorStr)
    finally:
        if connection_object.is_connected():
            cursor.close()
            connection_object.close()

createTable(
"""CREATE TABLE spot(
attraction_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
category VARCHAR(100),
description TEXT,
address TINYTEXT,
transport TEXT,
mrt VARCHAR(10),
latitude DECIMAL(9,7),
longitude DECIMAL(10,7),
images TEXT)"""
)

createTable(
"""CREATE TABLE user(
user_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(60) NOT NULL,
email VARCHAR(120) UNIQUE NOT NULL,
password VARCHAR(16) NOT NULL,
signup_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
sessionid VARCHAR(255) UNIQUE,
session_expiretime DOUBLE(15,4))"""
)

createTable(
"""CREATE TABLE booking(
booking_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
attraction_id INT,
trip_date DATE NOT NULL,
trip_time VARCHAR(10) NOT NULL,
trip_price SMALLINT NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE,
CONSTRAINT fk_attraction_id FOREIGN KEY (attraction_id) REFERENCES spot (attraction_id) ON UPDATE CASCADE
)"""
)

createTable(
"""CREATE TABLE ordering(
order_serial_number VARCHAR(16) PRIMARY KEY,
user_id INT,
attraction_id INT,
trip_date DATE NOT NULL,
trip_time VARCHAR(10) NOT NULL,
trip_price SMALLINT NOT NULL,
name VARCHAR(60) NOT NULL,
email VARCHAR(120) NOT NULL,
phone VARCHAR(15) NOT NULL,
payment_status VARCHAR(6) NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_ordering_user_id FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE,
CONSTRAINT fk_ordering_attraction_id FOREIGN KEY (attraction_id) REFERENCES spot (attraction_id) ON UPDATE CASCADE
)"""
)

createTable(
"""CREATE TABLE payment_query(
query_id INT AUTO_INCREMENT PRIMARY KEY,
order_serial_number VARCHAR(16),
merchant_id VARCHAR(50) NOT NULL,
amount SMALLINT NOT NULL,
tappay_number VARCHAR(3) NOT NULL,
detail VARCHAR(100) NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_payment_query_order_serial_number FOREIGN KEY (order_serial_number) REFERENCES ordering (order_serial_number) ON UPDATE CASCADE
)"""
)

createTable(
"""CREATE TABLE payment_response(
response_id INT AUTO_INCREMENT PRIMARY KEY,
query_id INT,
payment_status VARCHAR(6) NOT NULL,
message TINYTEXT NOT NULL,
rec_trade_id VARCHAR(20) NOT NULL,
order_serial_number VARCHAR(16) NOT NULL,
amount SMALLINT NOT NULL,
tappay_number VARCHAR(3) NOT NULL,
acquirer VARCHAR(50) NOT NULL,
transaction_time_millis VARCHAR(15) NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_payment_response_quary_id FOREIGN KEY (query_id) REFERENCES payment_query (query_id) ON UPDATE CASCADE
)"""
)