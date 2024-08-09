from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.autobid_config import AutobidConfig
from ...serializers.autobid_config import AutobidConfigSerializer


import json


def create_autobid_config(request: Request):
    try:
        payload = request.body
        print(payload)
        if not payload:
            return JsonResponse(
                {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        config_data = json.loads(payload.decode("utf-8"))
        user_id = config_data.get("user")
        print(user_id)
        if not user_id:
            return JsonResponse(
                {"message": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check if a config already exists for this user
        existing_config = AutobidConfig.objects.filter(user_id=user_id).first()
        print(config_data)
        if existing_config:
            return JsonResponse(
                {"message": "Auto-bid configuration for this user already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        print("CHECKPOINT-1")

        # If no existing config, proceed to create a new one
        serializer = AutobidConfigSerializer(data=config_data)

        print("CHECKPOINT-2")


        if serializer.is_valid():
            autobid_config = serializer.save()

            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error_messages = serializer.errors
            print(error_messages)


            return JsonResponse(
                {"message": error_messages}, status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        print(e)

        return JsonResponse(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )