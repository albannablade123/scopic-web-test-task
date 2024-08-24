from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.models import User


class NotificationSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_settings')
    notify_new_bid = models.BooleanField(default=True, help_text="Notify when there’s been a new bid on an item.")
    notify_bidding_finished = models.BooleanField(default=True, help_text="Notify when the bidding time has finished / the item was awarded.")
    notify_bid_amount_state = models.BooleanField(default=True, help_text="Notify when the total amount was bid + state of the item.")
    notify_exceeds_max_bid = models.BooleanField(default=True, help_text="Notify when the current bid exceeds the user's maximum auto-bid amount.")
    
    def __str__(self):
        return f"Notification Settings for {self.user.username}"