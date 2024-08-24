from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework import status

import json


def update_user_email(request, id):
    try:
        payload = request.body

        if not payload:
            return JsonResponse(
                {"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        user_data = json.loads(payload.decode("utf-8"))
        new_email = user_data['email']  # Assuming 'item' is a field in bid_data
        User = get_user_model()
        user = User.objects.get(id=id)
        user.update_email(new_email)
        return JsonResponse(
            {"status": "success", "message": "Email updated successfully."}, status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return JsonResponse(
            {"status": "Error", "message": f"User with id: {id} Not Found."}, status=status.HTTP_404_NOT_FOUND
        )
    except ValidationError as e:
        return JsonResponse(
            {"status": "Error", "message": f"{e}"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return {"status": "error", "message": f"An unexpected error occurred: {str(e)}"}