from django.utils import timezone
from ...models.notification import Notification;

def create_notification(user, message):
    Notification.objects.create(
        user=user,
        message=message,
        timestamp=timezone.now()
    )