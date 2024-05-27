from django.shortcuts import render
from django.db import models
from django.http import JsonResponse
from game.models import Game
from users.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from tournament.models import Tournament
import threading
import random
import time
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core import serializers

#//! put permisiion in login
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def choice(request):
	# for room in Room.objects.all():
	# 	room.delete()

	print('value ' + str(request.data))
	username = request.data.get('username')
	join = request.data.get('join')
	if (join):
		name = Tournament.getNextTournament()
		return Response({'room_name': name})
	playerCount = request.data.get('playerCount')
	tournamentId = request.data.get('tournamentId')

	user = User.objects.get(username=username)

	if (tournamentId == ''): #create a new room
		# user = User.objects.get(username=username)
		name = Tournament.createRoomName()
		print('name', name)
		tournament = Tournament.create(name=name,max_capacity=playerCount)
		print('maximum tournament', tournament.max_capacity)
		return Response({'room_name': name})
	#check if tournamendid exist
	tournament = Tournament.objects.filter(name=tournamentId)
	tournament = tournament.first()
	if (tournament is None):
		return Response({'Error':'Invalid tournament ID'})

	if tournament.checkAddUser(user) is False:
		return Response({'Error':'Room is full'})
	if (Tournament.objects.filter(players=user).exists()):
		return Response({'Error':'You are already inside a tournament'})
	
	print('maximum tournament', tournament.max_capacity)

	return Response({'room_name': tournament.name})
	# return Response({tournament.name})
	
# Create your views here.
def launch_tournament(tournament):
	users = tournament.player.all()# get the users who want to join a game (human)
	num_players =  tournament.player.count() # get the number of players in total (for the bot)
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
			if game.status == 'completed' or game.status == 'cancelled':
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



class Tournamen(WebsocketConsumer):
	def connect(self):
		room_name = self.scope['url_route']['kwargs']['room_name']
		print('Connecting to room: ', room_name)
		self.room_name = room_name
		self.tournament_name = room_name
		tournament, created = Tournament.objects.get_or_create(name=room_name)
		# self.tournament = tournament
		print('connect maximum tournament', tournament.max_capacity)

		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
		self.accept()
		user = self.scope['user']
		usernames = tournament.getAllUsername()
		for username in usernames:
			print("username: ", username)
			self.send(text_data=json.dumps({
				'type': 'username',
				'username': username,
				'name': room_name,
			}))
		friends_usernames = list(user.friends.all().values_list('username', flat=True))
		for friend in friends_usernames:
			self.send(text_data=json.dumps({
				'type':'friends',
				'friend': friend,
			}))
			print("send friend,",friend)
			
	
	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			self.room_name,
			self.channel_name
		)
		tournament = Tournament.objects.get(name=self.room_name)
		# return
		usernames = tournament.getAllUsername()
		print("player count: " + str(tournament.players.count()))
		if (tournament.players.count() <= 1):
			tournament.delete()
			print('tournament deleted')
		else:
			tournament.removeUser(self.scope['user'])
			print('user removed')
			for username in usernames:
				tournament.removeUser(User.objects.get(username=username))

			async_to_sync(self.channel_layer.group_send)(
				self.tournament_name,
				{
					'type':'disconnected',
					'username': 'all',
				}
			)
		print('Disconnected')

	def receive(self, text_data):
		# Tournament.objects.all().delete()
		text_data_json = json.loads(text_data)
		print(text_data_json)
		tipe = text_data_json['type']
		name = text_data_json['tournament']
		username = text_data_json['username']
		user = User.objects.get(username=username)
		tournament = Tournament.objects.get(name=name)
		tournaments= Tournament.objects.all()
		for pop in tournaments:
			print("Tournament name: ", pop.name)
			print("Tournament player count: ", pop.players.count())
		print('tournament name: ', self.room_name)
		tournament.addUser(user)
		print('receive maximum tournament', tournament.max_capacity)

		async_to_sync(self.channel_layer.group_send)(
			self.tournament_name,
			{
				'type':'tournament',
				'username': username,
				'name': name,
				'max_capacity': tournament.max_capacity,
			}
		)
		if (tournament.max_capacity == tournament.players.count()):
			timer = 3
			# return
			async_to_sync(self.channel_layer.group_send)(
				self.tournament_name,
				{
					'type':'launch_tournament',
					'timer': timer,
					'name': name,
				}
			)
			# time.sleep(timer)
			# launch_tournament(tournament)

	def tournament(self, event):
		self.send(text_data=json.dumps({
			'type':'username',
			'username': event['username'],
			'name': event['name'],
			'max_capacity': event['max_capacity'],
		}))
	
	def disconnected(self, event):
		self.send(text_data=json.dumps({
			'type': 'disconnected',
			'username': event['username'],
		}))
	
	def launch_tournament(self, event):
		self.send(text_data=json.dumps({
			'type': 'launch_tournament',
			'timer': event['timer'],
		}))
