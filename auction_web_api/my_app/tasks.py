from celery import shared_task
from celery import current_app 

from django.utils import timezone
from .models.item import Item

print("+++++++++++++++++++")
print(current_app.tasks.keys())
print("+++++++++++++++++++")
@shared_task
def sharedTask():
    print(current_task.request)

    result = 1 + 1
    print(f"The result is: {result}")


@shared_task
def close_expired_auctions():
    """
    Task to close all auctions that have expired but are not yet closed.
    """
    print("closed_expired_auction")
    now = timezone.now()
    expired_items = Item.objects.filter(is_closed=False, expiry_time__lte=now)

    for item in expired_items:
        item.close_auction()
