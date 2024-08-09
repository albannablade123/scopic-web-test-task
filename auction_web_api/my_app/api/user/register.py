import json
from ...serializers.user import UserSerializer
from rest_framework.request import Request
from rest_framework import status

from django.http.response import JsonResponse


def register_handler(request: Request):
    payload = request.body
    if not payload:
        return JsonResponse(
            {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
        )
    
    user_data = json.loads(payload.decode("utf-8"))

    serializer = UserSerializer(data=user_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return JsonResponse(
                {"message": "Succesfully Created"}, status=status.HTTP_200_OK
            )
 