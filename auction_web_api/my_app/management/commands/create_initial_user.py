from django.core.management.base import BaseCommand
import requests
from django.conf import settings

class Command(BaseCommand):
    help = 'Create an initial user'

    def handle(self, *args, **options):
        user_data = {
            "username": "admin1",
            "password": "admin1",
            "email": "admin1@example.com",
        }

        register_url = f'{settings.BASE_URL}/api/register/'  # Adjust URL as necessary

        response = requests.post(register_url, json=user_data)
        
        if response.status_code == 201:
            self.stdout.write(self.style.SUCCESS('Successfully created initial user'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to create initial user: {response.content}'))