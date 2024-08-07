import datetime
import jwt
from ...serializers.user import UserSerializer
from rest_framework.request import Request
from rest_framework import status
from django.contrib.auth import get_user_model

from django.http.response import JsonResponse
def login_handler(request: Request):

    username = request.data['username']
    password = request.data['password']
    print(username,password)
    User = get_user_model()

    user = User.objects.filter(username=username).first()

    if user is None:
        return JsonResponse(
            {"message":"User with this username Does not exist"}, status=status.HTTP_404_NOT_FOUND
        )
    
    if not user.check_password(password):
        return JsonResponse(
            {"message":"Incorrect Password"}, status=status.HTTP_404_NOT_FOUND
        )
    
    payload = {
        'id':user.id,
        'exp':datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=20),
        'iat':datetime.datetime.now(datetime.UTC)
    }
    token = jwt.encode(payload, 'secret', algorithm='HS256')
    return JsonResponse(
                {"jwt":token}, status=status.HTTP_200_OK
            )