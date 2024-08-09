from django.http.response import JsonResponse
from ...models.autobid_config import AutobidConfig
from ...serializers.autobid_config import AutobidConfigSerializer
from rest_framework.request import Request
from rest_framework import status
import json


def update_autobid_config_handler(request: Request, id: any):
    try:
        payload = request.body

        if not payload:
            return JsonResponse({"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        autobid_config_data = json.loads(payload.decode("utf-8"))

        autobid_config = AutobidConfig.objects.get(id=id)

        serializer = AutobidConfigSerializer(autobid_config, data=autobid_config_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        else:
            error_messages = serializer.errors

                
            return JsonResponse(
                {"message": error_messages}, status=status.HTTP_400_BAD_REQUEST
            )
    except AutobidConfig.DoesNotExist:
        return JsonResponse({"message": f"Autobid_config with id: {id} not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)