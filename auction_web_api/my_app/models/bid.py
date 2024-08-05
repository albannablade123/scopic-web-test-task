from django.db import models
from django.core.exceptions import ValidationError
from .item import Item
from django.contrib.auth.models import User

class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    auto_bidding = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
