# Generated by Django 5.0.2 on 2024-05-31 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_user_tournament'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='tournament_name',
            field=models.CharField(blank=True, max_length=6),
        ),
    ]
