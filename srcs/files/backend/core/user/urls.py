from django.urls import path
from . import views

urlpatterns = [
	path('profiles/', views.get_profiles),
	path('profiles/<int:pk>/', views.get_profile),
	path('profiles/create/', views.create_profile),
	path('profiles/update/<int:pk>/', views.update_profile),
	path('profiles/delete/<int:pk>/', views.delete_profile),
]