from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.autobid import Autobid
from ...serializers.autobid import AutobidSerializer
from ...models.item import Item

def update_auto_bid(request):
    user = request.user
    item_id = request.data.get('item_id')
    max_bid_amount = request.data.get('max_bid_amount')
    auto_bid_alert_percentage = request.data.get('auto_bid_alert_percentage')

    try:
        auto_bid = Autobid.objects.get(user=user, item_id=item_id)
        if max_bid_amount is not None:
            auto_bid.max_bid_amount = max_bid_amount
        if auto_bid_alert_percentage is not None:
            auto_bid.auto_bid_alert_percentage = auto_bid_alert_percentage
        auto_bid.save()

        return JsonResponse({"status": "Auto-bid updated successfully"}, status=status.HTTP_200_OK)
    except Autobid.DoesNotExist:
        return JsonResponse({"error": "Auto-bid not found"}, status=status.HTTP_404_NOT_FOUND)