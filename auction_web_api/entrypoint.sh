#!/bin/sh
ls
python manage.py migrate --no-input
python manage.py collectstatic --no-input
python manage.py loaddata users.json
python manage.py loaddata items.json
uvicorn auction_web_api.asgi:application --host 0.0.0.0 --port 8000