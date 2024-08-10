from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.notification import Notification
from ...serializers.notification import NotificationSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


import json


def get_notification_list_handler(request: Request):
    try:
        payload = request.body

        user_id = request.query_params.get('user_id')
        page_size = request.query_params.get('page_size', 10)  # Default to 10 if not provided
        page_number = request.query_params.get('page', 1) 
        

        # Building the filter arguments dynamically
        filter_args = {}

        if user_id:
            filter_args['user_id'] = user_id

        # Querying the notifications based on the filter_args
        notifications = Notification.objects.filter(**filter_args)
        paginator = Paginator(notifications, page_size)
        try:
            notifications_page = paginator.page(page_number)
        except PageNotAnInteger:
            notifications_page = paginator.page(1)
        except EmptyPage:
            notifications_page = paginator.page(paginator.num_pages)

        serializer = NotificationSerializer(notifications, many=True)
    
        return JsonResponse({
            'total_notifications': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': notifications_page.number,
            'page_size': paginator.per_page,
            'notifications': serializer.data,
        }, status=status.HTTP_201_CREATED, safe=False)

    except Exception as e:
        return JsonResponse(
            {"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )
