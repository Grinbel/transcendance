from django.db import models
from users.models import User
from tournament.models import Tournament

class Game(models.Model):
    STATE_CHOICE = [
        ('pending', 'Pending'),
        ('ingame', 'Ingame'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=255, choices=STATE_CHOICE, default='pending')
    player1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='player1')
    player2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='player2')
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, related_name='tournament')
    date = models.DateTimeField(auto_now_add=True)
    score1 = models.IntegerField()
    score2 = models.IntegerField()

    def __str__(self):
        return f"{self.player1} vs {self.player2} - {self.tournament}"

    def get_winner(self):
        if self.score1 > self.score2:
            return self.player1
        elif self.score1 < self.score2:
            return self.player2
        else:
            return None

    
    
    