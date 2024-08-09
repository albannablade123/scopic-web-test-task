from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.autobid import Autobid
from ...serializers.autobid import AutobidSerializer
from ...models.item import Item



import json


def create_or_update_auto_bid(request: Request):
    try:
        payload = request.body

        if not payload:
            return JsonResponse(
                {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        autobid_data = json.loads(payload.decode("utf-8"))

        user = request.user
        item_id = request.data.get('item_id')
        max_bid_amount = request.data.get('max_bid_amount')
        auto_bid_alert_percentage = request.data.get('auto_bid_alert_percentage')

        item = Item.objects.filter(id=item_id).first()

        if not item:
            return JsonResponse({"error": "Item does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        auto_bid, created = Autobid.objects.get_or_create(
        user=user,
        item=item,
        defaults={
            'max_bid_amount': max_bid_amount,
            'auto_bid_alert_percentage': auto_bid_alert_percentage,
            'auto_bidding_active': True
            }
        )
    
        serializer = AutobidSerializer(data=autobid_data)

        if not created:
            auto_bid.max_bid_amount = max_bid_amount
            auto_bid.auto_bid_alert_percentage = auto_bid_alert_percentage
            auto_bid.auto_bidding_active = True
            auto_bid.save()

        return JsonResponse({"status": "Auto-bid setup successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse(
            {"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )
