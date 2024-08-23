#!/bin/sh

if [ "$1" = 'celery' ]; then
  shift  # Remove 'celery' from the argument list
  celery --app=auction_web_api worker -l DEBUG "$@"
else
  ls
  python manage.py migrate --no-input
  python manage.py collectstatic --no-input
  python manage.py loaddata users.json
  python manage.py loaddata items.json

  uvicorn auction_web_api.asgi:application --host 0.0.0.0 --port 8000
fi
