from django.urls import path
from . import views

urlpatterns = [
	path('', views.get_profiles),
	path('<int:pk>/', views.get_profile),
	path('create/', views.create_profile),
	path('update/<int:pk>/', views.update_profile),
	path('delete/<int:pk>/', views.delete_profile),
]