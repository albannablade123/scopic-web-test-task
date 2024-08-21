from rest_framework import serializers
from ..models.bill import Bill

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = ['id', 'billing_address', 'user', 'item', 'amount', 'timestamp', 'bid']
        read_only_fields = ['id', 'timestamp']
