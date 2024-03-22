from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
	STATUS_CHOICES = [
		('busy', 'Busy'),
		('away', 'Away'),
		('available', 'Available'),
	]
	status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='available')
	#is_authenticated = models.BooleanField(default=False)
	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
	alias = models.CharField(max_length=255, null=True, blank=True)
	tournament = models.ForeignKey('tournament.Tournament', on_delete=models.SET_NULL, null=True, blank=True)

	def __str__(self):
		return f"username = {self.username} \n alias = {self.alias} \n email = {self.email}"