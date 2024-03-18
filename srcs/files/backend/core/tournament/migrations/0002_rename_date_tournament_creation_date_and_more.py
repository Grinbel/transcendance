# Generated by Django 5.0.2 on 2024-03-12 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tournament',
            old_name='date',
            new_name='creation_date',
        ),
        migrations.AddField(
            model_name='tournament',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('inprogress', 'In progress'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=255),
        ),
    ]