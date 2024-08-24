from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.bid import Bid
from ...serializers.bid import BidSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


import json


def get_bid_list_handler(request: Request):
    try:
        payload = request.body

        item_id = request.query_params.get('item_id')
        user_id = request.query_params.get('user_id')
        page_size = request.query_params.get('page_size', 10)  # Default to 10 if not provided
        page_number = request.query_params.get('page', 1) 

        # Building the filter arguments dynamically
        filter_args = {}
        if item_id:
            filter_args['item_id'] = item_id
        if user_id:
            filter_args['user_id'] = user_id

        # Querying the bids based on the filter_args
        bids = Bid.objects.filter(**filter_args)
        paginator = Paginator(bids, page_size)
        try:
            bids_page = paginator.page(page_number)
            
        except PageNotAnInteger:
            bids_page = paginator.page(1)
        except EmptyPage:
            bids_page = paginator.page(paginator.num_pages)

        serializer = BidSerializer(bids, many=True)
    
        return JsonResponse({
            'total_bids': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': bids_page.number,
            'page_size': paginator.per_page,
            'bids': serializer.data,
        }, status=status.HTTP_200_OK, safe=False)

    except Exception as e:
        return JsonResponse(
            {"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )
