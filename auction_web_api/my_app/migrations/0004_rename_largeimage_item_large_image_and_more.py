# Generated by Django 5.0.7 on 2024-08-09 11:27

import datetime
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0003_user_is_admin'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='largeImage',
            new_name='large_image',
        ),
        migrations.RenameField(
            model_name='item',
            old_name='smallImage',
            new_name='small_image',
        ),
        migrations.RemoveField(
            model_name='item',
            name='starting_price',
        ),
        migrations.AddField(
            model_name='item',
            name='is_closed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='item',
            name='start_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='item',
            name='starting_time',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
    ]
