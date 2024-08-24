# Generated by Django 5.0.7 on 2024-08-09 13:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0005_autobidconfig'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='starting_time',
        ),
        migrations.AddField(
            model_name='item',
            name='starting_price',
            field=models.DecimalField(decimal_places=2, default=20, max_digits=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='item',
            name='start_time',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
    ]
