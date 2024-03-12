from django.db import models
from users.models import User
from tournament.models import Tournament

class Game(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='player1')
    player2 = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='player2')
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, related_name='tournament')
    date = models.DateTimeField(auto_now_add=True)
    score1 = models.IntegerField()
    score2 = models.IntegerField()
    