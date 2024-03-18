from django.shortcuts import render
from django.db import models
from django.http import JsonResponse
from game.models import Game
from users.models import User
import threading

class bot
	id = 0
	

# Create your views here.
def matchmaking(request):
	users = User.objects.filter(id__in=request.GET.getlist('user_ids'))  # get the users who want to join a game
    num_players = int(request.GET['num_players'])  # get the number of players
	num_game = num_players / 2 + num_players % 2  # get the number of games

	# create the games
	games = []
	for i in range(num_game):
		game = Game.objects.create(player1=users[i*2], player2=users[i*2+1])
		games.append(game)