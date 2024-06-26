# Generated by Django 5.0.2 on 2024-06-10 11:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0003_tournament_ball_starting_speed_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournament',
            name='ball_starting_speed',
            field=models.FloatField(default=0.5),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='texture_ball',
            field=models.CharField(default='opacity.png'),
        ),
    ]
