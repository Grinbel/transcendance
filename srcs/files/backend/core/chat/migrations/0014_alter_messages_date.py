# Generated by Django 5.0.2 on 2024-05-28 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0013_alter_messages_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='messages',
            name='date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
