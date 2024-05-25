from django.db import models

from users.models import User
import random
import string
import time
# Create your models here.
class Tournament(models.Model):
	STATUS_CHOICES = [
		('pending', 'Pending'),
		('inprogress', 'In progress'),
		('completed', 'Completed'),
		('cancelled', 'Cancelled'),
	]
	name = models.CharField(max_length=6, unique=True, blank=True)
	status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
	creation_date = models.DateTimeField(auto_now_add=True)
	# players = models.ManyToManyField('users.User', related_name='participant')
	# winner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='winner', null=True, blank=True)
	max_capacity = models.IntegerField(default=2)
	# admin = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='admin', blank=True, null=True)
	
	@staticmethod
	def createRoomName():
		name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
		while Tournament.objects.filter(name=name).exists():
			name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
		return name

	@classmethod
	def create(self, max_capacity=8, user=None, name=None):
		self = Tournament.objects.create(name=name)
		self.max_capacity = max_capacity
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
			print('user added to room ',self)
			self.players.add(user)
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
		return [user.username for user in self.players.all()]

	@classmethod
	def getNextTournament(self):
		tournaments = Tournament.objects.filter(status='pending')
		buff = 8
		name = ''
		print("Tournament")
		if tournaments.count() == 0:
			return Tournament.createRoomName()
		for tournament in tournaments:
			j = tournament.max_capacity - tournament.players.count()
			print ("Tournament name:%s ",tournament.name)
			print ("Tournament player count:",j)
			print("buff:",buff)
			if  j < buff:
				buff = j
				name = tournament.name
		return name

	def __str__(self):
		return self.name