from typing import Any
from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.bill import Bill
from ...serializers.bill import BillSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


import json

def get_bill_list_handler(request: Request,  id: Any):
    try:
        payload = request.body

        # Querying the bills based on the filter_args
        filter_args = {"user":id}

        bills = Bill.objects.filter(**filter_args)
        # paginator = Paginator(bills, page_size)
        # try:
        #     bills_page = paginator.page(page_number)
            
        # except PageNotAnInteger:
        #     bills_page = paginator.page(1)
        # except EmptyPage:
        #     bills_page = paginator.page(paginator.num_pages)

        serializer = BillSerializer(bills, many=True)
    
        return JsonResponse({
            # 'total_bills': paginator.count,
            # 'total_pages': paginator.num_pages,
            # 'current_page': bills_page.number,
            # 'page_size': paginator.per_page,
            'bills': serializer.data,
        }, status=status.HTTP_200_OK, safe=False)

    except Exception as e:
        return JsonResponse(
            {"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )
