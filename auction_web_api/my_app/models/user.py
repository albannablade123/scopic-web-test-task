from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.forms import ValidationError


class User(AbstractUser):
    # Additional fields here if needed
    class Meta:
        unique_together = (('username', 'email'),)

    notification_email = models.EmailField(blank=False, null=False, default="default@example.com")


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

    def save(self, *args, **kwargs):
        # Add custom logic here if needed
        if self.notification_email and User.objects.filter(notification_email=self.notification_email).exclude(pk=self.pk).exists():
            raise ValidationError("A user with this email already exists.")
        super(User, self).save(*args, **kwargs)

    def update_email(self, new_email):
        # Custom method to update email
        if User.objects.filter(notification_email=new_email).exclude(pk=self.pk).exists():
            raise ValidationError("A user with this email already exists.")
        self.notification_email = new_email
        self.save()