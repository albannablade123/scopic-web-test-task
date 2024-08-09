from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from .item import Item

class AutobidConfig(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    max_bid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=1000)
    auto_bid_alert_percentage = models.IntegerField(default=90)