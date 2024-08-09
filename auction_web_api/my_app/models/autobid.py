from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from .item import Item

class Autobid(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    max_bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_auto_bid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remaining_bid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    auto_bid_alert_percentage = models.IntegerField(default=90)
    auto_bidding_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)     

    def clean(self):
        if self.max_bid_amount <= self.current_auto_bid_amount:
            raise ValidationError("Max bid amount must be greater than the current auto bid amount.")
        if not (0 <= self.auto_bid_alert_percentage <= 100):
            raise ValidationError("Auto bid alert percentage must be between 0 and 100.")

    def __str__(self):
        return f"AutoBid for {self.user.username} on {self.item}"