from typing import Any
from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.bill import Bill
from ...serializers.bill import BillSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


import json

def get_bill_by_item_list_handler(request: Request,  id: Any):
    try:
        payload = request.body

        # Querying the bills based on the filter_args
        filter_args = {"item":id}

        bill = Bill.objects.get(item_id=id)

        # paginator = Paginator(bills, page_size)
        # try:
        #     bills_page = paginator.page(page_number)
            
        # except PageNotAnInteger:
        #     bills_page = paginator.page(1)
        # except EmptyPage:
        #     bills_page = paginator.page(paginator.num_pages)

        serializer = BillSerializer(bill)
    
        return JsonResponse({
            # 'total_bills': paginator.count,
            # 'total_pages': paginator.num_pages,
            # 'current_page': bills_page.number,
            # 'page_size': paginator.per_page,
            'bill': serializer.data,
        }, status=status.HTTP_200_OK, safe=False)
    except Bill.DoesNotExist:
        return JsonResponse(
            {"message": f"Bill does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )

    except Exception as e:
        return JsonResponse(
            {"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )
