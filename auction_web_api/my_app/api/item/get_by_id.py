from typing import Any
from rest_framework.request import Request
from rest_framework import status
from ...models.item import Item
from ...models.bid import Bid
from ...serializers.item import ItemSerializer
from django.http.response import JsonResponse
from django.db.models import OuterRef, Subquery



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
    

def get_unique_items_bidded_by_user(request: Request, user_id):
    """
    Retrieve all unique items that the specified user has bid on.
    """

    try:
        latest_bids_subquery = Bid.objects.filter(
        user_id=user_id,
        item=OuterRef('pk')
        ).order_by('-timestamp').values('status')[:1]

        # Annotate the Item queryset with the latest bid status
        # items_with_latest_bids = Item.objects.annotate(
        #     latest_bid_status=Subquery(latest_bids_subquery)
        # ).filter(id__in=Bid.objects.filter(user_id=user_id).values('item').distinct())

        items_with_latest_bids = Item.objects.annotate(
        latest_bid_status=Subquery(latest_bids_subquery)
        ).filter(
            id__in=Bid.objects.filter(user_id=user_id).values('item_id').distinct()
        )
        serializer = ItemSerializer(items_with_latest_bids, many=True, context={'user_id': user_id})

        print(serializer.data)
        return JsonResponse(
                serializer.data,
                status=status.HTTP_200_OK,
                safe=False
            )
    except Item.DoesNotExist:
        return JsonResponse(
            {"message": f"Item with id {id} does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except:
       return JsonResponse(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )    # Get all bids for the specified user
