# Generated by Django 5.0.2 on 2024-06-05 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_user_tournament_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='language',
            field=models.CharField(blank=True, default='en', max_length=255),
        ),
    ]
