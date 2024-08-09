from ..models.autobid_config import AutobidConfig
from rest_framework import serializers


class AutobidConfigSerializer(serializers.ModelSerializer):

    class Meta:
        model = AutobidConfig
        fields = ['id', 'user', 'max_bid_amount', 'auto_bid_alert_percentage']

    def validate_max_bid_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Maximum bid amount must be greater than zero.")
        return value

    def validate_auto_bid_alert_percentage(self, value):
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Auto bid alert percentage must be between 0 and 100.")
        return value

    def validate(self, data):
        # Add any other cross-field validations here if needed
        return data