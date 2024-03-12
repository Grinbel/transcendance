from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
	alias = models.CharField(max_length=255, null=True, blank=True)
	tournament = models.ForeignKey('tournament.Tournament', on_delete=models.SET_NULL, null=True, blank=True)
	STATUS_CHOICES = [
		('busy', 'Busy'),
		('away', 'Away'),
		('available', 'Available'),
	]
#class Tournament(models.Model):
#     name = models.CharField(max_length=100)
#     start_date = models.DateTimeField()
#     end_date = models.DateTimeField()
#     participants = models.ManyToManyField(Profile)

# class Game(models.Model):
#     player1 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='games_as_player1')
#     player2 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='games_as_player2')
#     score1 = models.IntegerField()
#     score2 = models.IntegerField()
#     tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='games')

# class ChatMessage(models.Model):
#     sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_messages')
#     recipient = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_messages')
#     message = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)