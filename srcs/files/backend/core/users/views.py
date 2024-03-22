# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from rest_framework.views import APIView
# from .models import User
# from .serializers import UserSerializer
# from
# from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status,  permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MyTokenObtainPairSerializer
from .serializers import UserSerializer
from .permissions import UserPermission
from .models import User
 
##remember to check USER_ID_FIELD and USER_ID_CLAIM in jwt settings in case picking the email adress as the user id


class Login(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MyTokenObtainPairSerializer

class Signup(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format='json'):
        serializer_context = {
            'request': request,
        }
        print('request.data', request.data)
        serializer = UserSerializer(data=request.data, context=serializer_context)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class Logout(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format='json'):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token) # create a RefreshToken instance from the refresh token obtained to access the Class methods as blacklist()
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
class UserList(APIView):
    permission_classes = [UserPermission]

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


# import random
# import string
# from datetime import datetime, timedelta
# from django.contrib.auth import authenticate
# from django.utils.timezone import make_aware
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from .serializers import MyTokenObtainPairSerializer

# class Login(APIView):
#     serializer_class = MyTokenObtainPairSerializer

#     def generate_verification_code(self):
#         return ''.join(random.choices(string.digits, k=6))  # Generate a 6-digit random code

#     def send_verification_code(self, user, code):
#         # Implement code to send verification code to the user (e.g., via email, SMS)
#         pass

#     def post(self, request, *args, **kwargs):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(username=username, password=password)
#         if user is not None:
#             verification_code = self.generate_verification_code()
#             self.send_verification_code(user, verification_code)

#             # Store verification code and expiration time in session
#             request.session['verification_code'] = verification_code
#             request.session['verification_code_expiry'] = make_aware(datetime.now() + timedelta(minutes=5))

#             return Response({"message": "Please enter the verification code"}, status=status.HTTP_200_OK)
#         else:
#             return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

#     def verify(self, request, *args, **kwargs):
#         verification_code = request.data.get('verification_code')

#         # Check if verification code matches the one stored in the session
#         stored_code = request.session.get('verification_code')
#         if verification_code == stored_code:
#             # Check if verification code is still valid
#             expiry_time = request.session.get('verification_code_expiry')
#             if expiry_time and expiry_time > datetime.now():
#                 # If valid, authenticate user and return token
#                 username = request.data.get('username')
#                 password = request.data.get('password')
#                 user = authenticate(username=username, password=password)
#                 if user is not None:
#                     serializer = self.serializer_class(data={'username': username, 'password': password})
#                     if serializer.is_valid():
#                         token = serializer.validated_data['access']
#                         return Response({"token": token}, status=status.HTTP_200_OK)
#                 return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
#             else:
#                 return Response({"message": "Verification code has expired"}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             return Response({"message": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)
