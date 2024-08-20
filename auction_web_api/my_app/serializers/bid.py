# from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from ..models.bid import Bid
from ..models.item import Item
from rest_framework import serializers


class BidSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bid
        fields = ['id', 'user', 'item', 'amount', 'auto_bidding', 'timestamp']

    def validate(self, data):
        item = data['item']
        user = data['user']
        amount = data['amount']
        User = get_user_model()

        # Ensure that the item exists
        if not Item.objects.filter(id=item.id).exists():
            raise serializers.ValidationError("The item does not exist.")

        # Ensure that the user exists
        if not User.objects.filter(id=user.id).exists():
            raise serializers.ValidationError("The user does not exist.")
        
         # Ensure that the bid amount is greater than or equal to the starting price of the item
        item_instance = Item.objects.get(id=item.id)
        if amount < item_instance.starting_price:
            raise serializers.ValidationError(f"Your bid must be at least {item_instance.starting_price}.")

        # Ensure that the bid amount is greater than the current highest bid
        highest_bid = Bid.objects.filter(item=item).order_by('-amount').first()
        if highest_bid and amount <= highest_bid.amount:
            raise serializers.ValidationError("Your bid must be higher than the current highest bid.")
        
        # Optionally, add logic to prevent manual bids if auto-bidding is enabled
        if data['auto_bidding']:
            # Additional validation logic for auto-bids if necessary
            pass
        
        return data