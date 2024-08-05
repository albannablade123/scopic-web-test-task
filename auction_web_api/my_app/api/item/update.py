import json

from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from typing import Any
from ...models.item import Item
from ...serializers.item import ItemSerializer


def update_item_handler(request: Request, id: Any):
    try:
        payload = request.body

        if not payload:
            return JsonResponse({"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        item_data = json.loads(payload.decode("utf-8"))

        item = Item.objects.get(id=id)

        serializer = ItemSerializer(item, data=item_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        else:
            error_messages = serializer.errors

                
            return JsonResponse(
                {"message": error_messages}, status=status.HTTP_400_BAD_REQUEST
            )
    except Item.DoesNotExist:
        return JsonResponse({"message": f"Item with id: {id} not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)