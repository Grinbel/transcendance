from django.db import models

from users.models import User
import random
import string
import time
from datetime import timedelta
from django.utils import timezone
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
# Create your models here.
class Tournament(models.Model):
	STATUS_CHOICES = [
		('pending', 'Pending'),
		('inprogress', 'In progress'),
		('completed', 'Completed'),
		('cancelled', 'Cancelled'),
	]
	name = models.CharField(max_length=6, unique=True, blank=True)
	creator = models.CharField(max_length=20, blank=True)
	status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
	creation_date = models.DateTimeField(auto_now_add=True)
	players = models.ManyToManyField('users.User', related_name='participant')
	# winner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='winner', null=True, blank=True)
	max_capacity = models.IntegerField(default=2)
	# admin = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='admin', blank=True, null=True)
	ball_starting_speed = models.FloatField(default=0.05)
	texture_ball = models.CharField(default="basketball.jpg")
	score = models.IntegerField(default=10)
	easyMode = models.BooleanField(default=False)
	skin = models.IntegerField(default=2)



	@staticmethod
	def createRoomName():
		name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
		while Tournament.objects.filter(name=name).exists():
			name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
		return name

	@classmethod
	def create(self, max_capacity=2, user=None, name=None,ball_starting_speed=0.05,texture_ball="basketball.jpg",score=10,easyMode=False,skin=2):
		self = Tournament.objects.create(name=name)
		self.max_capacity = max_capacity
		self.ball_starting_speed = ball_starting_speed/1000
		self.texture_ball = texture_ball
		self.score = score
		self.easyMode = easyMode
		self.skin = skin
		if user:
			# tournament.admin = user
			self.addUser (user)
		self.save()
		return self
	
	def addUser(self,user):
		if (self.players.filter(id=user.id).exists()):
			return False
		if self.players.count() == self.max_capacity:
			return False
		else:
			# user.tournament = self
			# print('user added to room ',self)
			# print("TEXTURE:",self.texture_ball)

			self.players.add(user)
			self.save()
			return True

	def checkAddUser(self,user):
		if (self.players.filter(id=user.id).exists()):
			return False
		if self.players.count() == self.max_capacity:
			return False
		else:
			return True

	def removeUser(self,user):
		if (user in self.players.all()):
			self.players.remove(user)
			return True
		return False

	def getUser(self,user):
		return self.players.get(id=user.id)

	def getAllUsername(self):
		return [players.username for players in self.players.all()]
	
	def getAllAvatar(self):
		return [players.avatar.url for players in self.players.all()]

	def getAllAlias(self):
		return [players.alias for players in self.players.all()]
	
	@classmethod
	def getNextTournament(self,alias,name):
		tournaments = Tournament.objects.filter(status='pending')
		buff = 8
		name = ''
		if tournaments.count() == 0:
			return Tournament.createRoomName()
		# print("Get next tournament:",tournaments)
		for tournament in tournaments:
			# print("tournament name in getnextTournament:",tournament.name)
			aliass = tournament.getAllAlias()
			j = tournament.max_capacity - tournament.players.count()
			if j < buff and not ((aliass is not None and alias in aliass )):
				buff = j
				name = tournament.name
		# print("choice1",name)

		if name == '':
			return Tournament.createRoomName()
		# print("choice2",name)
		return name

	def checkExpiration(self):
		result = self.creation_date + timedelta(minutes=20) < timezone.now()
		if (result == True):
			self.status = 'cancelled'
			async_to_sync(get_channel_layer().group_send)(
				self.name,
				{
					'type':'quit_game',
				})
			# self.players.clear()
			players = self.players.all()
			for player in players:
				self.removeUser(player)
			self.delete()
			self.save()
			return True
		else:
			return False
	def __str__(self):
		return ', '.join(f'{key}: {value}' for key, value in self.__dict__.items())