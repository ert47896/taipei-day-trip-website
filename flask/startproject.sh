#!/bin/sh
cd /workspace/flask/app
python ./module/initMysql.py
python ./data/datatosql.py
uwsgi --ini app.ini