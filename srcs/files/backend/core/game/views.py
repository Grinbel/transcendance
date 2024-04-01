from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


# Create your views here.
@api_view(['POST'])
def pong(request):
    # Récupérer les données envoyées depuis le frontend React
    donnees = request.data

    # Effectuer les calculs nécessaires (dans votre cas, les calculs pour le jeu Pong)

    # Supposons que vous avez des données de réponse A, B, C à renvoyer au frontend React
    reponse = {'A': 100, 'B': 200, 'C': 300}

    return Response(reponse)