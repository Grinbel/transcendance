# users/serializers.py
 
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

 
from .models import User
 
class UserSerializer(ModelSerializer):
	 
	class Meta:
		model = User
		fields = ["url", "username", "password"]
		extra_kwargs = {"password": {"write_only": True}}

	def create(self, validated_data):
		user = User(username=validated_data["username"])
		password = validated_data.pop('password', None)
		if password is not None:
			user.set_password(password)
		user.save()
		return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

	@classmethod
	def get_token(cls, user):
		token = super(MyTokenObtainPairSerializer, cls).get_token(user)

		# Add custom claims
		token['fav_fruit'] = 'banana'
		return token
