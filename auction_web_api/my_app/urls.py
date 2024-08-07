from django.urls import re_path
from my_app import views 
 
urlpatterns = [ 
    re_path(r'^api/item$', views.item_collection),
    re_path(r'^api/item/(?P<id>[0-9]+)$', views.item),
    re_path(r'^api/register$', views.user_register, name='user_register'),
    re_path(r'^api/login$', views.user_login, name='user_login'),

]