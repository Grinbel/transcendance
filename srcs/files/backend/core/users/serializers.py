# users/serializers.py
 
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
 
class UserSerializer(ModelSerializer):
	 
	class Meta:
		model = User
		fields = ['id', 'otp', 'otp_expiry_time','username', 'password', 'email', 'is_staff', 'two_factor']
		extra_kwargs = {"password": {"write_only": True}}

	def create(self, validated_data):
		user = User(username=validated_data["username"])

		print('validated-data in serializerrrr', validated_data)
		password = validated_data.pop('password', None)
		user.email = validated_data.pop('email', None)
		
		if password is not None:
			print('password in serializer before hashing', password)
			user.is_active = True
			user.set_password(password)
		user.save()
		return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

	@classmethod
	def get_token(cls, user):
		token = super(MyTokenObtainPairSerializer, cls).get_token(user)
		print('User in get_token', user)

		# Add custom claims
		token['fav_fruit'] = 'banana'
		return token
