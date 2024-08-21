from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib.auth.models import User

class Bid(models.Model):

    class Status(models.TextChoices):
        IN_PROGRESS = 'in_progress', 'In Progress'
        LOST = 'lost', 'Lost'
        WON = 'won', 'Won'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    auto_bidding = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_PROGRESS,
    )
