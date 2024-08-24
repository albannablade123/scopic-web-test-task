# Generated by Django 5.0.7 on 2024-08-09 12:20

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0004_rename_largeimage_item_large_image_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AutobidConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('max_bid_amount', models.DecimalField(decimal_places=2, default=1000, max_digits=10)),
                ('auto_bid_alert_percentage', models.IntegerField(default=90)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
