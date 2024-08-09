from typing import Any

from django.http.response import JsonResponse
from rest_framework.request import Request
from rest_framework import status
from ...models.autobid_config import AutobidConfig
from ...serializers.autobid_config import AutobidConfigSerializer
def get_autobid_config_list_handler(request: Request, id: Any):
    try:
        autobid_config = AutobidConfig.objects.get(user=id)

        serializer = AutobidConfigSerializer(autobid_config)

        return JsonResponse(
                serializer.data,
                status=status.HTTP_200_OK,
            )
    
    except AutobidConfig.DoesNotExist:
        return JsonResponse(
            {"message": f"Item with id {id} does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )

    except Exception as e:
        return JsonResponse(
            {"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False
        )
