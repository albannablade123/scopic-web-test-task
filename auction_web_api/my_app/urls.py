from django.urls import re_path
from my_app import views 
 
urlpatterns = [ 
    re_path(r'^api/item$', views.item_collection),
    re_path(r'^api/item/(?P<id>[0-9]+)$', views.item),
    re_path(r'^api/item/(?P<id>[0-9]+)/bill$', views.get_bill_by_item, name='item-bill'),
    re_path(r'^api/register$', views.user_register, name='user_register'),
    re_path(r'^api/login$', views.user_login, name='user_login'),
    re_path(r'^api/logout$', views.user_logout, name='user_logout'),
    re_path(r'^api/user$', views.user, name='get_user'),
    re_path(r'^api/user/(?P<id>[0-9]+)/update-email$', views.update_email_view, name='update-email'),
    re_path(r'^api/bid$', views.bid_collection, name='create_bid'),
    re_path(r'^api/notification$', views.notification_collection, name='notification'),
    re_path(r'^api/config$', views.configuration_collection, name='notification'),
    re_path(r'^api/config/(?P<id>[0-9]+)$', views.configuration),
    re_path(r'^api/autobid$', views.autobid_collection, name='autobid'),
    re_path(r'^api/autobid/(?P<id>[0-9]+)$', views.autobid),
    re_path(r'^api/autobid/toggle$', views.toggle_autobid, name='turn_off_auto_bid'),
    re_path(r'^api/bill/(?P<id>[0-9]+)$', views.get_bills_by_user_id, name='get_bills'),
    re_path(r'^api/user/(?P<id>[0-9]+)/bid$', views.get_items_by_user, name='user-bids'),
]