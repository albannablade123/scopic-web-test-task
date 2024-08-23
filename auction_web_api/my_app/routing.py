from django.urls import re_path
from .channels import BidConsumer  # Adjust the import path if needed

websocket_urlpatterns = [
    re_path(r'^ws/bid/(?P<item_id>\d+)/$', BidConsumer.as_asgi()),
]