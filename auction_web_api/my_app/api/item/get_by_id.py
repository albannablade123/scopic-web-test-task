from typing import Any
from rest_framework.request import Request
from rest_framework import status
from ...models.item import Item
from ...serializers.item import ItemSerializer
from django.http.response import JsonResponse


def get_item_by_id_handler(request: Request, id: Any):
    try:
        item = Item.objects.get(id=id)
        serializer = ItemSerializer(item)
        return JsonResponse(
                serializer.data,
                status=status.HTTP_200_OK,
            )
    except Item.DoesNotExist:
        return JsonResponse(
            {"message": f"Item with id {id} does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return JsonResponse(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )