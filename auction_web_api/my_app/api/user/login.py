import datetime
import jwt
from ...serializers.user import UserSerializer
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed


from rest_framework import status
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt


from django.http.response import JsonResponse

@csrf_exempt
def login_handler(request: Request):

    username = request.data['username']
    password = request.data['password']
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
        'isAdmin':user.is_admin,
        'exp':datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=20),
        'iat':datetime.datetime.now(datetime.UTC)
    }
    token = jwt.encode(payload, 'secret', algorithm='HS256')
    response = Response()

    response.set_cookie(key='jwt', value=token, httponly=True)
    response.data = {
        'jwt': token
    }
    return response


def get_user_handler(request: Request):
    token = request.COOKIES.get('jwt')
    if not token:
        raise AuthenticationFailed('Unauthenticated!')

    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Unauthenticated!')
    
    User = get_user_model()

    user = User.objects.filter(id=payload['id']).first()
    serializer = UserSerializer(user)
    return Response(serializer.data)