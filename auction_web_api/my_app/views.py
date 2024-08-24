from django.shortcuts import render
from rest_framework.request import Request
from rest_framework.decorators import api_view

from .api.user.update_email import update_user_email

from .api.item.create import create_item_handler
from .api.item.delete import delete_item_handler
from .api.item.get_list import get_item_list_handler
from .api.item.get_by_id import get_item_by_id_handler, get_unique_items_bidded_by_user
from .api.item.update import update_item_handler
from .api.user.login import login_handler
from .api.user.register import register_handler
from .api.user.logout import logout_handler
from .api.user.login import get_user_handler
from .api.bid.create import create_bid_handler
from .api.bid.get_list import get_bid_list_handler
from .api.notification.create import create_notification_handler
from .api.notification.get_by_user import get_notification_list_handler

from .api.autobid_configuration.get import get_autobid_config_list_handler
from .api.autobid_configuration.create import create_autobid_config
from .api.autobid_configuration.update import update_autobid_config_handler
from .api.bill.get_bills_by_user import get_bill_list_handler
from .api.bill.get_bills_by_item_id import get_bill_by_item_list_handler

from .api.autobid.autobid import update_auto_bid, toggle_auto_bid, create_or_update_auto_bid, get_auto_bid


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
    
@api_view(['POST','GET'])
def user_register(request: Request):
    if request.method == 'POST':
        return register_handler(request)
    
@api_view(['POST'])
def user_login(request: Request):
    if request.method == 'POST':
        return login_handler(request)
    
@api_view(['POST'])
def user_logout(request: Request):
    if request.method == 'POST':
        return logout_handler(request)
    
@api_view(['GET'])
def user(request: Request):
    if request.method == 'GET':
        return get_user_handler(request)
    
@api_view(['POST', 'GET'])
def bid_collection(request: Request):
    if request.method == 'POST':
        return create_bid_handler(request)
    
    if request.method == 'GET':
        return get_bid_list_handler(request)
    
@api_view(['POST', 'GET'])
def notification_collection(request: Request):
    if request.method == 'POST':
        return create_notification_handler(request)
    
    if request.method == 'GET':
        return get_notification_list_handler(request)
    
@api_view(['POST'])
def configuration_collection(request: Request):
    if request.method == 'POST':
        return create_autobid_config(request)
    
@api_view(['GET', 'PUT'])
def configuration(request: Request, id):
    if request.method == 'GET':
        return get_autobid_config_list_handler(request, id)
    if request.method == 'PUT':
        return update_autobid_config_handler(request, id)


    
@api_view(['POST','GET'])
def autobid_collection(request: Request):
    if request.method == 'POST':
        return create_or_update_auto_bid(request)
    if request.method == 'GET':
        return get_auto_bid(request)
    

@api_view(['GET', 'PUT'])
def autobid(request: Request, id):
    if request.method == 'GET':
        return get_auto_bid(request)
    # if request.method == 'PUT':
    #     return update_autobidr(request, id)
    
@api_view(['PATCH'])
def toggle_autobid(request: Request):
    if request.method == 'PATCH':
        return toggle_auto_bid(request)
    

@api_view(['GET'])
def get_bills_by_user_id(request: Request, id):
    if request.method == 'GET':
        return get_bill_list_handler(request, id)
    
@api_view(['GET'])
def get_items_by_user(request: Request, id):
    if request.method == 'GET':
        return get_unique_items_bidded_by_user(request, id)

@api_view(['GET'])
def get_bill_by_item(request: Request, id):
    if request.method == 'GET':
        return get_bill_by_item_list_handler(request, id)

@api_view(['POST'])
def update_email_view(request: Request, id):
    if request.method == "POST":
        return update_user_email(request, id)
