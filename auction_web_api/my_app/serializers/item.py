from datetime import datetime, timezone
from ..models.item import Item
from ..serializers.bid import BidSerializer
from rest_framework import serializers
import pytz

from django.utils import timezone

# from rest_framework import serializers

class ItemSerializer(serializers.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        ordering = ['-id']
        model = Item
        fields = ['id', 'name', 'description', 'small_image', 'large_image', 'starting_price', 'expiry_time', 'start_time','bids']
        extra_kwargs = {
            'smallImage': {'required': False, 'allow_blank': True},
            'large_image': {'required': False, 'allow_blank': True},
        }

    def validate(self, data):
        utc=pytz.UTC

        # Ensure that expiry_time is after starting_time
        if 'expiry_time' in data and 'start_time' in data:
            if data['expiry_time'] <= data['start_time']:
                raise serializers.ValidationError("Expiry time must be later than the starting time.")

        # Ensure that start_time is not in the past
        now = timezone.now()

        if 'start_time' in data:
            if data['expiry_time']  < now:
                raise ValueError("Start time must be after the current time.")


        return data