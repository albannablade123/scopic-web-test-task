import datetime

import jwt
from ...serializers.user import UserSerializer
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from django.contrib.auth import get_user_model

from django.http.response import JsonResponse
def logout_handler(request: Request):

    response = Response()
    response.delete_cookie("jwt")
    response.data = {
        "message": "success"
    }

    return response