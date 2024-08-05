from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.item import Item
from ...serializers.item import ItemSerializer
from django.core.paginator import Paginator


def get_item_list_handler(request: Request):
    try:
        item_list = Item.objects.all()
        page = request.query_params.get('page', '10')
        paginator = Paginator(item_list, page)
        serializer = ItemSerializer(item_list, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)
    except Exception as e:
      return JsonResponse({'message':e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)
