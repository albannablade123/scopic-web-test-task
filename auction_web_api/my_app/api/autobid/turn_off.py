from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.autobid import Autobid
from ...serializers.autobid import AutobidSerializer
from ...models.item import Item

def turn_off_auto_bid(request:Request):
    user = request.user
    item_id = request.data.get('item_id')

    try:
        auto_bid = Autobid.objects.get(user=user, item_id=item_id)
        auto_bid.auto_bidding_active = False
        auto_bid.save()

        return JsonResponse({"status": "Auto-bidding turned off successfully"}, status=status.HTTP_200_OK)
    except Autobid.DoesNotExist:
        return JsonResponse({"error": "Auto-bid not found"}, status=status.HTTP_404_NOT_FOUND)