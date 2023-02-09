from connectMysql import connection_pool
import time

# Create tables
def executeTable(sqlQuery):
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

executeTable(
"""DROP TABLE IF EXISTS payment_response,
payment_query,
ordering,
booking,
user,
spot"""
)

executeTable(
"""CREATE TABLE spot(
attraction_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(128),
category VARCHAR(128),
description TEXT,
address TINYTEXT,
transport TEXT,
mrt VARCHAR(10),
latitude DECIMAL(9,7),
longitude DECIMAL(10,7),
images TEXT)"""
)

executeTable(
"""CREATE TABLE user(
user_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(64) NOT NULL,
email VARCHAR(128) UNIQUE NOT NULL,
password VARCHAR(128) NOT NULL,
signup_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
sessionid VARCHAR(256) UNIQUE,
session_expiretime DOUBLE(15,4))"""
)

executeTable(
"""CREATE TABLE booking(
booking_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
attraction_id INT,
trip_date DATE NOT NULL,
trip_time VARCHAR(16) NOT NULL,
trip_price SMALLINT NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE,
CONSTRAINT fk_attraction_id FOREIGN KEY (attraction_id) REFERENCES spot (attraction_id) ON UPDATE CASCADE
)"""
)

executeTable(
"""CREATE TABLE ordering(
order_serial_number VARCHAR(16) PRIMARY KEY,
user_id INT,
attraction_id INT,
trip_date DATE NOT NULL,
trip_time VARCHAR(16) NOT NULL,
trip_price SMALLINT NOT NULL,
name VARCHAR(64) NOT NULL,
email VARCHAR(128) NOT NULL,
phone VARCHAR(16) NOT NULL,
payment_status VARCHAR(6) NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_ordering_user_id FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE,
CONSTRAINT fk_ordering_attraction_id FOREIGN KEY (attraction_id) REFERENCES spot (attraction_id) ON UPDATE CASCADE
)"""
)

executeTable(
"""CREATE TABLE payment_query(
query_id INT AUTO_INCREMENT PRIMARY KEY,
order_serial_number VARCHAR(16),
merchant_id VARCHAR(64) NOT NULL,
amount SMALLINT NOT NULL,
tappay_number VARCHAR(4) NOT NULL,
detail VARCHAR(128) NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_payment_query_order_serial_number FOREIGN KEY (order_serial_number) REFERENCES ordering (order_serial_number) ON UPDATE CASCADE
)"""
)

executeTable(
"""CREATE TABLE payment_response(
response_id INT AUTO_INCREMENT PRIMARY KEY,
query_id INT,
payment_status VARCHAR(8) NOT NULL,
message TINYTEXT NOT NULL,
rec_trade_id VARCHAR(32) NOT NULL,
order_serial_number VARCHAR(16) NOT NULL,
amount SMALLINT NOT NULL,
tappay_number VARCHAR(4) NOT NULL,
acquirer VARCHAR(50) NOT NULL,
transaction_time_millis VARCHAR(16) NOT NULL,
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_payment_response_quary_id FOREIGN KEY (query_id) REFERENCES payment_query (query_id) ON UPDATE CASCADE
)"""
)
