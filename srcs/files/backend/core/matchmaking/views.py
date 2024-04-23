from django.shortcuts import render
from django.db import models
from django.http import JsonResponse
from game.models import Game
from users.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from .models import Room
import threading
import random
import time
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class bot:
	id = 0


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def choice(request):
	# for room in Room.objects.all():
	# 	room.delete()
	print('value ' + str(request.data))
	username = request.data.get('username')
	playerCount = request.data.get('playerCount')
	tournamentId = request.data.get('tournamentId')
	print('All room names: ', [room.name for room in Room.objects.all()])
	print('room name: ', Room.objects.all().first().name)
	user = User.objects.get(username=username)
	print('username ', username)
	print('playerCount ', playerCount)
	print('tournamentId ', tournamentId)
	if (tournamentId == ''): #create a new room
		user = User.objects.get(username=username)
		room = Room.create(playerCount, user)
		return Response({'Room created': room.name})
	#check if tournamendid exist
	room = Room.objects.filter(name=tournamentId)
	room = room.first()
	if (room is None):
		return Response({'Error':'Invalid tournament ID'})
	# print('room ' + str(room))
	if room.addUser(user) is False:
		return Response({'Error':'Room is full'})

	return Response({'room_name': room.name})
	# return Response({room.name})
	
# Create your views here.
def launch_tournament(request):
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


class Tournament(WebsocketConsumer):
	def connect(self):
		self.room_name = 'test'
		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
		self.accept()

		print('Connected')
	
	def disconnect(self, close_code):
		print('Disconnected')
		self.send(text_data=json.dumps({
			'message': 'Disconnected',
			'type': 'disconnection'
		}))

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		print(text_data_json)
		message = text_data_json['message']
		date = text_data_json['date']
		username = text_data_json['username']
		async_to_sync(self.channel_layer.group_send)(
			self.room_name,
			{
				'type':'chat_message',
				'message':message,
				'username':self.scope['user'].username,
				'date': date,
				'username': username,
			}
		)

	def chat_message(self, event):
		message = event['message']
		username = event['username']
		date = event['date']
		self.send(text_data=json.dumps({
			'type':'chat',
			'message':message,
			'date': date,
			'username': username,

		}))