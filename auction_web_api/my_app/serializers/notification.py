from rest_framework import serializers
from ..models.notification import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'is_read', 'message', 'timestamp', 'user']
        read_only_fields = ['timestamp', 'user']