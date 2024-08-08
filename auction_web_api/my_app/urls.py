from django.urls import re_path
from my_app import views 
 
urlpatterns = [ 
    re_path(r'^api/item$', views.item_collection),
    re_path(r'^api/item/(?P<id>[0-9]+)$', views.item),
    re_path(r'^api/register$', views.user_register, name='user_register'),
    re_path(r'^api/login$', views.user_login, name='user_login'),
    re_path(r'^api/logout$', views.user_logout, name='user_logout'),
    re_path(r'^api/user$', views.user, name='get_user'),


]