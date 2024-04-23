from django.db import models
from users.models import User
import random
import string

# Create your models here.



class Room(models.Model):
	name = models.CharField(max_length=6, unique=True, blank=True)
	max_capacity = models.IntegerField(default=2)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	users = models.ManyToManyField('users.User', related_name='room', blank=True)
	# admin = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='admin', blank=True, null=True)

	def save(self, *args, **kwargs):
		if not self.name:
			self.name = self.create_room()
		super().save(*args, **kwargs)

	@staticmethod
	def createRoomName():
		name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
		while Room.objects.filter(name=name).exists():
			name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
		return name

	@classmethod
	def create(cls, max_capacity=8, user=None):
		room = cls.objects.create(name=Room.createRoomName())
		room.max_capacity = max_capacity
		if user:
			# room.admin = user
			room.addUser (user)
		return room
	
	def addUser(self,user):
		if (user.tournament is not None):
			return False
		if self.users.count() == self.max_capacity:
			return False
		else:
			user.tournament = self
			print('user added to room ',self)
			self.users.add(user)
			return True

	def removeUser(self,user):
		if (user in self.users.all()):
			self.users.remove(user)
			return True
		return False

	def getUser(self,user):
		return self.users.get(id=user.id)

	def getAllUsername(self):
		return [user.username for user in self.users.all()]

	def __str__(self):
		return self.name