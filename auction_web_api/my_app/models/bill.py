from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.forms import ValidationError
from .item import Item



class Bill(models.Model):

    billing_address = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    bid = models.ForeignKey('Bid', on_delete=models.CASCADE, related_name='bills')  # Mandatory

    def __str__(self):
        return f"Bill {self.id} - {self.user} - {self.amount}"

    def clean(self):
        if self.amount <= 0:
            raise ValidationError("Amount must be positive")