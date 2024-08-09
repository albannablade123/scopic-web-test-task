from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import AutoBid, Bid, Item
from django.core.exceptions import ObjectDoesNotExist

@api_view(['POST'])
def update_max_bid_amount(request):
    user = request.user
    item_id = request.data.get('item_id')
    new_max_bid_amount = request.data.get('max_bid_amount')

    try:
        auto_bids = AutoBid.objects.filter(user=user, item_id=item_id)
        
        for auto_bid in auto_bids:
            auto_bid.max_bid_amount = new_max_bid_amount
            auto_bid.save()
            
            # Check and update related bids if necessary
            bids = Bid.objects.filter(item_id=item_id, user=user)
            for bid in bids:
                if bid.amount > new_max_bid_amount:
                    # Handle bid exceeding new max bid amount
                    bid.delete()  # or adjust bid as necessary
                    # Notify user if needed

        return Response({"status": "Auto-bids updated successfully"}, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response({"error": "Auto-bid not found"}, status=status.HTTP_404_NOT_FOUND)