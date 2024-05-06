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
	otp = models.CharField(max_length=6, blank=True)
	otp_expiry_time = models.DateTimeField(blank=True, null=True)
	two_factor = models.BooleanField(default=False)
	avatar = models.ImageField(upload_to='avatars/', default='yoshi.jpg')
	alias = models.CharField(max_length=255, null=True, blank=True)
	tournament = models.ForeignKey('tournament.Tournament', on_delete=models.SET_NULL, null=True, blank=True)
	friends = models.ManyToManyField('self', blank=True)

	def __str__(self):
		return f"username = {self.username} \n email = {self.email}"