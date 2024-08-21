from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone

from ..models.bid import Bid




class Item(models.Model): 
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField(default=datetime.now, blank=True)
    expiry_time = models.DateTimeField()
    small_image = models.URLField(max_length=200, default='', blank=True)
    large_image = models.URLField(max_length=200, default='', blank=True)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_closed = models.BooleanField(default=False)  
    winning_bid = models.ForeignKey('Bid', on_delete=models.SET_NULL, null=True, blank=True, related_name='winning_item')
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_items')


    def close_auction(self):
        """
        Method to close the auction, set the item as closed, and record the winning bid and user.
        This should be called when the auction expires or when you manually close the auction.
        """
        if not self.is_closed and self.expiry_time <= timezone.now():
            highest_bid = self.bid_set.order_by('-amount').first()
            if highest_bid:
                # Mark the highest bid as the winning bid
                highest_bid.status = Bid.Status.WON
                highest_bid.save()

                # Update the item with the winning bid and user
                self.winning_bid = highest_bid
                self.winner = highest_bid.user

                # Mark all other bids as lost
                self.bid_set.exclude(id=highest_bid.id).update(status=Bid.Status.LOST)

            self.is_closed = True
            self.save()


    def __str__(self):
        return self.name
