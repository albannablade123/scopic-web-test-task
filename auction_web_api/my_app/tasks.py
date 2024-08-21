from time import sleep
from celery import shared_task
from celery import current_app
from django import db
import pytz
from .utils.get_items import get_items
from .api.item.get_list import get_item_list_handler

from django.db import transaction

from django.utils import timezone
from .models.item import Item
from .models.bid import Bid

from .utils.create_bill import create_bill

from celery import shared_task
from django.db import transaction
from .models.bid import Bid
from .models.item import Item

@shared_task
def update_bids_status_to_lost(item_id):
    """
    Task to update the status of all bids associated with a given item to 'lost'.
    """
    with transaction.atomic():
        # Fetch the item by ID
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            # Handle the case where the item does not exist
            print(f"Item with ID {item_id} does not exist.")
            return

        # Update all associated bids to 'lost'
        bids = Bid.objects.filter(item=item)
        updated_count = bids.update(status=Bid.Status.LOST)

        # Log or print the result
        print(f"Updated {updated_count} bids to 'lost' for item with ID {item_id}.")


@shared_task
def close_expired_auctions():
    """
    Task to close all auctions that have expired but are not yet closed.
    """

    with transaction.atomic():
        now = timezone.now()
        items = get_items()
        # test = get_item_list_handler()
        assumed_tz = pytz.timezone('America/New_York')

        expired_items = Item.objects.filter(is_closed=False)
        for item in expired_items:

            if item.expiry_time:
                # Check if expiry_time is naive (lacking timezone information)
                if item.expiry_time.tzinfo is None:
                    # Localize the naive datetime to the assumed timezone
                    local_expiry_time = assumed_tz.localize(item.expiry_time)
                else:
                    # If it's already timezone-aware, use it directly
                    local_expiry_time = item.expiry_time

                # Convert to UTC
                utc_expiry_time = local_expiry_time.astimezone(pytz.UTC)
                # print(f"Item ID: {item.id}, Expiry Time: {item.expiry_time}, UTC Expiry Time: {utc_expiry_time}")

                # Check if the item is expired
                # print(now, utc_expiry_time, utc_expiry_time <= now)
                if not item.is_closed and utc_expiry_time <= now:
                    item.close_auction()

                    bid = Bid.objects.filter(item=item).last()  # Adjust as needed to get the correct Bid
                    if bid:
                        create_bill(item, bid)

                    update_bids_status_to_lost(item.id)

