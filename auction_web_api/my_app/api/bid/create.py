from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status

from ...utils.process_bid import process_auto_bids
from ...models.bid import Bid
from ...serializers.bid import BidSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync




import json


def create_bid_handler(request: Request):
    try:
        payload = request.body

        if not payload:
            return JsonResponse(
                {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        bid_data = json.loads(payload.decode("utf-8"))
        serializer = BidSerializer(data=bid_data)

        if serializer.is_valid():
            bid = serializer.save()

            item_id = bid_data['item']  # Assuming 'item' is a field in bid_data
            user_id = bid_data['user']
            # Process auto-bid settings after creating the bid
            process_auto_bids(item_id,user_id)

            # Broadcast the new bid to the WebSocket group
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'item_{item_id}',
                {
                    'type': 'bid_update',  # This refers to the bid_update method in your consumer
                    'bid': {
                        'id': bid.id,
                        'item': item_id,
                        'user': bid.user.id,
                        'amount': float(bid.amount),
                        'timestamp': bid.timestamp.isoformat(),
                    }
                }
            )

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
    


