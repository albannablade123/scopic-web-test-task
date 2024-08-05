from rest_framework import serializers
from django.contrib.auth.models import User
from models.bid import Bid

class BidSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bid
        fields = ['user', 'amount', 'auto_bidding', 'timestamp']