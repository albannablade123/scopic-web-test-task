from time import sleep
from celery import shared_task
from celery import current_app
from django import db
import pytz

from .utils.get_items import get_items
from .api.item.get_list import get_item_list_handler

from django.db import transaction
from django.contrib.auth import get_user_model

from django.utils import timezone
from .models.item import Item
from .models.bid import Bid

from .utils.create_bill import create_bill

from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.conf import settings

from celery import shared_task
from django.db import transaction
from .models.bid import Bid
from .models.item import Item

@shared_task
def update_bids_status_to_lost(item_id, winning_bid_id=None):
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
        if winning_bid_id:
            bids = bids.exclude(id=winning_bid_id)
        updated_count = bids.update(status=Bid.Status.LOST)

        # Log or print the result
        print(f"Updated {updated_count} bids to 'lost' for item with ID {item_id}.")

@shared_task
def send_max_bid_exceeded_notification(user_id, item_id, alert_percentage):
    try:
        print("C1")
        User = get_user_model()
        user = User.objects.get(id=user_id)  # Ensure we have a User instance
        item = Item.objects.get(id=item_id)
        print("C2")
        email = "sandpichdich@gmail.com"
        recipient_list = [email]
        subject=f"Exceeded Maximum Bid amount for Item: {item.name}"
        message = """
        Dear {username}
        
        Your auto-bid has reached {alert_percentage}% of the maximum bid amount after creating a bid for item {item_name}.
        
        Best Regards,
        Antique Action
        """.format(
            username=user.username,
            alert_percentage=alert_percentage,
            item_name= item.name
            )
        send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list, fail_silently=True)
    except Exception as e:
      print(f'An exception occurred:{e}')

@shared_task
def send_award_notification(user_id, item_id):
    try:
        User = get_user_model()
        user = User.objects.get(id=user)  # Ensure we have a User instance

        notification_settings = user.notification_settings

        # Check if the user has enabled notifications for bidding finished
        if notification_settings.notify_bidding_finished:
            # Assuming you have an Item model to fetch the item details
            item = Item.objects.get(id=item_id)
            # send_mail(
            #     'Congratulations! You won the bid',
            #     f'You have won the bid for {item.name}.',
            #     'from@example.com',
            #     [user.email],
            #     fail_silently=False,
            # )
    except User.DoesNotExist:
        # Handle the case where the user does not exist
        pass
    # except NotificationSettings.DoesNotExist:
    #     # Handle the case where the notification settings do not exist
    #     pass

def send_awarded_bid_email_notificiation(item, bill, bid):
    item_name = item.name
    winning_bid_amount = bill.amount
    User = get_user_model()
    user = User.objects.get(id=bid.user.id)  # 
    username = user.username
    email_body = """
    Dear {your_name},

    I am delighted to inform you that you have successfully won the auction for {item_name}! Congratulations on securing this fantastic item. Your bid of {winning_bid_amount} was the highest, and we are thrilled to complete this transaction with you.

    Please review the details of your winning item below:
    - Item Name: {item_name}
    - Winning Bid Amount: {winning_bid_amount}

    To finalize your purchase, please proceed with the payment using your preferred payment method. Once the payment is confirmed, we will arrange for the shipment of your item to the following address:

    If you have any questions or need assistance, please don't hesitate to contact us. We are here to ensure a smooth and enjoyable experience for you.

    Thank you for participating in our auction, and congratulations once again on your winning bid! We look forward to your continued participation in future auctions.

    Best regards,

    Antique Auction
    """.format(
        your_name=username,
        item_name=item_name,
        winning_bid_amount=winning_bid_amount,
    )
    subject = "Congratulations on Winning the Auction"
    message = "Dear Customer, your bid has been succesfully processed"
    email = "sandpichdich@gmail.com"
    recipient_list = [email]
    send_mail(subject, email_body, settings.EMAIL_HOST_USER, recipient_list, fail_silently=True)

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

                    winning_bid = Bid.objects.filter(item=item).last()  # Adjust as needed to get the correct Bid
                    if winning_bid:
                        bill = create_bill(item, winning_bid)
                        send_awarded_bid_email_notificiation(item, bill, winning_bid)

                    update_bids_status_to_lost(item.id,  winning_bid.id if winning_bid else None)

