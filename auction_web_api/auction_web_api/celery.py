import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auction_web_api.settings')
app = Celery("auction_web_api")
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.beat_scheduler = 'django_celery_beat.schedulers:DatabaseScheduler'

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

app.conf.beat_schedule = {
    'close-expired-auctions-every-minute': {
        'task': 'my_app.tasks.close_expired_auctions',
        'schedule': crontab(minute='*/1'),  # Run every minute
    },
}



@app.task
def divide(x, y):
    import time
    time.sleep(5)
    return x / y