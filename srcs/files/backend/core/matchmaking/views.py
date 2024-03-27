from django.shortcuts import render
from django.db import models
from django.http import JsonResponse
from game.models import Game
from users.models import User
import threading
import random
import time

class bot
	id = 0
	

# Create your views here.
def matchmaking(request):
	users = User.objects.filter(id__in=request.GET.getlist('user_ids'))  # get the users who want to join a game (human)
	num_players = int(request.GET['num_players'])  # get the number of players in total (for the bot)
	# for i in range(num_players -len(users) ):
		#! //! need to add bot ?
		#users.add(bot)
	random.shuffle(users)
	num_game = num_players / 2 + num_players % 2  # get the number of games

	# create the games
	games = []

	while num_game >= 0.5:
		for i in range(num_game):
			game = Game.objects.create(player1=users[i*2], player2=users[i*2+1])
			games.append(game)
		for game in games:
			match_thread = threading.Thread(target=launch_match, args=(game,))
			match_thread.start() #! //!
		# wait for the games to be completed
		while len(games) > 0:
			if game.status == 'completed' || game.status == 'cancelled':
				games.remove(game)
			time.sleep(1)
		# get the winners and create the next round
		for i in range(num_game):
			winner = games[i].get_winner()
			if winner is not None:
				users.append(winner)
			else: #! //! Is it possible to have a draw?
				users.append(random.choice([games[i].player1, games[i].player2]))
		users = winners
			
		num_game /= 2
		