from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET', 'POST'])
def player_collection(request: Request):
    if request.method == 'GET':
        return get_item_list_handler(request)
    elif request.method == 'POST':
        return create_item_handler(request)


@api_view(['PUT', 'DELETE'])
def player(request: Request, id):
    if request.method == 'PUT':
        return update_item_handler(request, id)
    elif request.method == 'DELETE':
        return delete_item_handler(request, id)


@api_view(['POST'])
def team_process(request: Request):
    if request.method == 'POST':
        return team_process_handler(request)
