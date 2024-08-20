#!/bin/sh

ls
python manage.py migrate --no-input
python manage.py collectstatic --no-input
python manage.py loaddata users.json
python manage.py loaddata items.json

gunicorn auction_web_api.wsgi:application --bind 0.0.0.0:8000