from django.shortcuts import render

# Create your views here.
import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

@require_POST
def login_view(request):
	data = json.loads(request.body)
	username = data['username']
	password = data['password']
	user = authenticate(request, username=username, password=password)
	if user is not None:
		login(request, user)
		return JsonResponse({'message': 'You are logged in.'})
	return JsonResponse({'message': 'Invalid credentials.'}, status=401)

def logout_view(request):
	if not request.user.is_authenticated:
		return JsonResponse({'you are not logged in.'}, status=401)
	logout(request)
	return JsonResponse({'message': 'You are logged out.'})

@ensure_csrf_cookie
def session_view(request):
	if not request.user.is_authenticated:
		return JsonResponse({'result': False})
	return JsonResponse({'result': True})

def whoami_view(request):
	if not request.user.is_authenticated:
		return JsonResponse({'username': None})
	return JsonResponse({'username': request.user.username})