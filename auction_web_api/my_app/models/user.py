from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class User(AbstractUser):
    # Additional fields here if needed
    class Meta:
        unique_together = (('username', 'email'),)

    is_admin = models.BooleanField(default=False, help_text='Designates whether the user is an admin.')


    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # Updated related_name to avoid clash
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name='custom_user',
    )
    
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',  # Updated related_name to avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='custom_user',
    )