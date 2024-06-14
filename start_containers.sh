#!/bin/sh

# Fonction pour arrêter les conteneurs
stop_containers() {
    echo "Stopping containers..."
    docker compose -f ./srcs/docker-compose.yml down
    exit 0
}

# Définir le trap pour intercepter SIGINT
trap stop_containers INT

# Démarrer les conteneurs
docker compose -f ./srcs/docker-compose.yml up --renew-anon-volumes

