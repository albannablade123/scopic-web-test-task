## /////////////////////////////////////////////////////////////////////////////
## YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
## /////////////////////////////////////////////////////////////////////////////

from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.item import Item
from ...serializers.item import ItemSerializer


import json


def create_item_handler(request: Request):
    try:
        payload = request.body

        if not payload:
            return JsonResponse(
                {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        item_data = json.loads(payload.decode("utf-8"))
        serializer = ItemSerializer(data=item_data)

        if serializer.is_valid():
            item = serializer.save()
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
