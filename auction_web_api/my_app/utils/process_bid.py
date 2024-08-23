from decimal import Decimal

from ..tasks import send_max_bid_exceeded_notification
from ..serializers.notification import NotificationSerializer
from ..serializers.bid import BidSerializer
from ..models.autobid import Autobid
from ..models.bid import Bid
from django.db import models, transaction


def process_auto_bids(item_id, triggering_user_id=None):
    # Fetch the current highest bid for the item    
    # Fetch active auto-bids for the item
    auto_bids = Autobid.objects.filter(item_id=item_id, auto_bidding_active=True).order_by('created_at')
    for auto_bid in auto_bids:

        max_bid_amount = auto_bid.max_bid_amount
        current_auto_bid_amount = auto_bid.current_auto_bid_amount
        alert_percentage = Decimal(auto_bid.auto_bid_alert_percentage)  # Convert to Decimal
        user_id = auto_bid.user.id  # Fetch the user ID for notifications

        # Fetch the highest bid amount currently placed for the item
        highest_bid = Bid.objects.filter(item_id=item_id).order_by('-amount').first()
        highest_bid_amount = highest_bid.amount if highest_bid else Decimal('0.00')

        bid_increment = Decimal('1.00')  # Ensure bid increment is Decimal
        new_bid_amount = highest_bid_amount + bid_increment

        # Ensure the new bid amount does not exceed the max bid amount
        if new_bid_amount <= max_bid_amount and new_bid_amount > current_auto_bid_amount and user_id != triggering_user_id:
            # Create a new bid for this auto-bid
            new_bid_data = {
                'item': item_id,
                'amount': new_bid_amount,
                'user': auto_bid.user.id,  # Ensure the bid is created on behalf of the user
                'auto_bidding': True
            }

            new_bid_serializer = BidSerializer(data=new_bid_data)
            if new_bid_serializer.is_valid():
                with transaction.atomic():
                    # Save the new bid
                    new_bid_serializer.save()

                    # Update auto-bid with the new amount
                    auto_bid.current_auto_bid_amount = new_bid_amount
                    auto_bid.save()

                    # Check if the threshold percentage is reached
                    threshold_amount = (alert_percentage / Decimal('100')) * max_bid_amount
                    if new_bid_amount >= threshold_amount:
                        # Create a new notification
                        notification_data = {
                            'user': user_id,
                            'item': item_id,
                            'message': f"Your auto-bid has reached {alert_percentage}% of the maximum bid amount for item {item_id}.",
                            # Add any other required fields for Notification
                        }
                        send_max_bid_exceeded_notification(alert_percentage=alert_percentage, user_id=user_id, item_id=item_id)

                        notification_serializer = NotificationSerializer(data=notification_data)
                        if notification_serializer.is_valid():
                            notification_serializer.save()
                        else:
                            print("Error creating notification:", notification_serializer.errors)
            else:
                print("Error creating new bid:", new_bid_serializer.errors)
        elif new_bid_amount > max_bid_amount:
            # If the new bid exceeds the maximum allowed, deactivate the auto-bid
            auto_bid.auto_bidding_active = False
            auto_bid.save()
 