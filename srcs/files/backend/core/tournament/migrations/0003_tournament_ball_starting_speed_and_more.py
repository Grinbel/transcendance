# Generated by Django 5.0.2 on 2024-06-10 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0002_tournament_players'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='ball_starting_speed',
            field=models.IntegerField(default=0.5),
        ),
        migrations.AddField(
            model_name='tournament',
            name='texture_ball',
            field=models.CharField(default='badboy.png'),
        ),
    ]
