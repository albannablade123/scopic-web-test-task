import json
from ...serializers.user import UserSerializer
from rest_framework.request import Request
from rest_framework import status

from django.http.response import JsonResponse


def register_handler(request: Request):
    payload = request.body
    print("checkpoint 1")
    if not payload:
        return JsonResponse(
            {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
        )
    
    print("checkpoint 2")

    user_data = json.loads(payload.decode("utf-8"))
    print("checkpoint 3")

    serializer = UserSerializer(data=user_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return JsonResponse(
                {"message": "Succesfully Created"}, status=status.HTTP_200_OK
            )
 