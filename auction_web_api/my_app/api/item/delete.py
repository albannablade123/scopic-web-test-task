from typing import Any
from rest_framework.request import Request
from rest_framework import status
from ...models.item import Item
from ...serializers.item import ItemSerializer
from django.http.response import JsonResponse


def delete_item_handler(request: Request, id: Any):
    try:
        item = Item.objects.get(id=id)
        item.delete()
        return JsonResponse(
                {"message": "Item deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
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