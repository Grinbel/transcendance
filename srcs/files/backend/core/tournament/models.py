from django.db import models

# Create your models here.
class Tournament(models.Model):
	STATUS_CHOICES = [
		('pending', 'Pending'),
		('inprogress', 'In progress'),
		('completed', 'Completed'),
		('cancelled', 'Cancelled'),
	]
	status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
	name = models.CharField(max_length=255)
	creation_date = models.DateTimeField(auto_now_add=True)
	players = models.ManyToManyField('users.User', related_name='participant')
	winner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='winner', null=True, blank=True)

	def __str__(self):
		return self.name