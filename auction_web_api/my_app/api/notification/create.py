from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.notification import Notification
from ...serializers.notification import NotificationSerializer


import json


def create_notification_handler(request: Request):
    try:
        payload = request.body

        if not payload:
            return JsonResponse(
                {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        notification_data = json.loads(payload.decode("utf-8"))
        serializer = NotificationSerializer(data=notification_data)
        print(notification_data)
        if serializer.is_valid():
            notification = serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error_messages = serializer.errors

            return JsonResponse(
                {"message": error_messages}, status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        return JsonResponse(
            {"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )
