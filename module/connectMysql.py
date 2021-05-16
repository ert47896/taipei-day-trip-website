from mysql.connector import pooling
import sys

#建立connection_pool供attraction API與user API使用
#connection pool let api have more permanent connections to MySQL
connection_pool = pooling.MySQLConnectionPool(
    host="localhost",
    user=sys.argv[1],
    password=sys.argv[2],
    database="stage2",
    pool_name="mypool",
    pool_size=5
)