# Generated by Django 5.0.2 on 2024-05-21 12:52

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messages',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2024, 5, 21, 14, 52, 39, 964383)),
        ),
    ]
