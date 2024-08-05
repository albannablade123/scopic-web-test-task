from ..models.item import Item
from ..serializers.bid import BidSerializer
from rest_framework import serializers

# from rest_framework import serializers

class ItemSerializer(serializers.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        ordering = ['-id']
        model = Item
        fields = ['id', 'name', 'description', 'smallImage', 'largeImage', 'starting_price', 'expiry_time','bids']