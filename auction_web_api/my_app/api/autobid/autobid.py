from django.http.response import JsonResponse
from rest_framework.request import Request
from django.db import models
from rest_framework import status
from ...models.autobid import Autobid
from ...serializers.autobid import AutobidSerializer
from ...models.item import Item
from ...models.bid import Bid
from ...models.autobid_config import AutobidConfig
from django.contrib.auth import get_user_model

import json

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


def toggle_auto_bid(request: Request):
    item_id = request.query_params.get('item_id')
    user_id = request.query_params.get('user_id')
    auto_bidding_active = request.data.get('auto_bidding_active')

    if auto_bidding_active is None:
        return JsonResponse({"error": "auto_bidding_active field is required"}, status=status.HTTP_400_BAD_REQUEST)

    if auto_bidding_active:
        # Create or update auto-bid
        auto_bid, created = Autobid.objects.get_or_create(
            user=user_id,
            item_id=item_id,
            defaults={
                'auto_bidding_active': auto_bidding_active,
                # Set default values for other fields if needed
            }
        )
        
        if not created:
            auto_bid.auto_bidding_active = auto_bidding_active
            auto_bid.save()
            return JsonResponse({"status": "Auto-bid activated"}, status=status.HTTP_200_OK)
        
    else:
        try:
            auto_bid = Autobid.objects.get(user=user_id, item_id=item_id)
            auto_bid.auto_bidding_active = auto_bidding_active
            auto_bid.save()
            return JsonResponse({"status": "Auto-bid deactivated"}, status=status.HTTP_200_OK)
        except Autobid.DoesNotExist:
            return JsonResponse({"error": "Auto-bid not found"}, status=status.HTTP_404_NOT_FOUND)
    
def create_or_update_auto_bid(request: Request):

    payload = request.body

    if not payload:
        return JsonResponse(
            {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
        )
    
    autobid_data = json.loads(payload.decode("utf-8"))

    item_id = autobid_data.get('item')
    max_bid_amount = autobid_data.get('max_bid_amount')
    auto_bid_alert_percentage = autobid_data.get('auto_bid_alert_percentage')
    user = autobid_data.get('user')

 # Fetch the user by user_id
    try:
        User = get_user_model()
        user = User.objects.get(id=user)  # Ensure we have a User instance
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
    try:
        autobid_config = AutobidConfig.objects.get(user=user)
        max_bid_amount = autobid_config.max_bid_amount
    except AutobidConfig.DoesNotExist:
        return JsonResponse({"error": "Autobid configuration not found."}, status=status.HTTP_404_NOT_FOUND)

    item = Item.objects.filter(id=item_id).first()
    if not item:
        return JsonResponse({"error": "Item does not exist."}, status=status.HTTP_404_NOT_FOUND)

    total_auto_bid_amount = Autobid.objects.filter(user=user).aggregate(total=models.Sum('current_auto_bid_amount'))['total'] or 0

    remaining_bid_amount = max_bid_amount - total_auto_bid_amount

    if max_bid_amount > remaining_bid_amount:
        return JsonResponse({"error": "Exceeds remaining bid amount."}, status=status.HTTP_400_BAD_REQUEST)
    
    

    auto_bid, created = Autobid.objects.get_or_create(
        user=user,
        item=item,
        defaults={
            'max_bid_amount': max_bid_amount,
            'current_auto_bid_amount': 0,
            'remaining_bid_amount': remaining_bid_amount,
            'auto_bid_alert_percentage': auto_bid_alert_percentage,
            'auto_bidding_active': True
        }
    )

    if not created:
        auto_bid.max_bid_amount = max_bid_amount
        auto_bid.remaining_bid_amount = remaining_bid_amount
        auto_bid.auto_bid_alert_percentage = auto_bid_alert_percentage
        auto_bid.auto_bidding_active = True
        auto_bid.save()

    return JsonResponse({"status": "Auto-bid setup successfully"}, status=status.HTTP_200_OK)


def get_auto_bid(request):
    item_id = request.query_params.get('item_id')
    user_id = request.query_params.get('user_id')

    print(item_id,user_id)

    if not user_id or not item_id:
        return JsonResponse({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        auto_bid = Autobid.objects.get(user_id=user_id, item_id=item_id)
        serializer = AutobidSerializer(auto_bid)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)
    except Autobid.DoesNotExist:
        return JsonResponse({"error": "Auto-bid not found"}, status=status.HTTP_404_NOT_FOUND)
    
def get_current_bid_amount(item):
    highest_bid = Bid.objects.filter(item=item).order_by('-amount').first()
    return highest_bid.amount if highest_bid else 0