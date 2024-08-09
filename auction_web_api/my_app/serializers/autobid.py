from ..models.autobid import AutoBid
from rest_framework import serializers


class AutobidSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutoBid
        fields = ['user', 'item', 'max_bid_amount', 'remaining_bid_amount', 'auto_bid_alert_percentage', 'auto_bidding_active']

        def validate(self, data):
            max_bid_amount = data.get('max_bid_amount')
            current_auto_bid_amount = data.get('current_auto_bid_amount')
            auto_bid_alert_percentage = data.get('auto_bid_alert_percentage')

            if max_bid_amount <= current_auto_bid_amount:
                raise serializers.ValidationError("Max bid amount must be greater than the current auto bid amount.")
            if auto_bid_alert_percentage is not None and not (0 <= auto_bid_alert_percentage <= 100):
                raise serializers.ValidationError("Auto bid alert percentage must be between 0 and 100.")

            return data