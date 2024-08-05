from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.decorators import api_view

from .api.item.create import create_item_handler
from .api.item.delete import delete_item_handler
from .api.item.get_list import get_item_list_handler
from .api.item.get_by_id import get_item_by_id_handler
from .api.item.update import update_item_handler

# # Create your views here.
@api_view(['GET', 'POST'])
def item_collection(request: Request):
    if request.method == 'GET':
        return get_item_list_handler(request)
    elif request.method == 'POST':
        return create_item_handler(request)


@api_view(['PUT', 'DELETE', 'GET'])
def item(request: Request, id):
    if request.method == 'GET':
        return get_item_by_id_handler(request, id)
    elif request.method == 'PUT':
        return update_item_handler(request, id)
    elif request.method == 'DELETE':
        return delete_item_handler(request, id)
