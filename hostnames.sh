#!/bin/bash

# Lire le contenu du fichier /etc/hostname
new_address=$(cat /etc/hostname)

# Assigner le contenu du fichier /etc/hostname à la variable VITE_API_SERVER_ADDRESS
sed -i "s/^VITE_API_SERVER_ADDRESS=.*/VITE_API_SERVER_ADDRESS=\"$new_address\"/" ./srcs/.env