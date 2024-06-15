#!/bin/bash

# Lire le contenu du fichier /etc/hostname
# new_address=$(cat /etc/hostname)
new_address_home='localhost'

# Assigner le contenu du fichier /etc/hostname à la variable VITE_API_SERVER_ADDRESS
# Assigner le contenu du fichier /etc/hostname à la variable VITE_API_SERVER_ADDRESS
sed -i.bak "s/^VITE_API_SERVER_ADDRESS=.*/VITE_API_SERVER_ADDRESS=\"$new_address_home\"/" ./srcs/.env

# Remove the backup file
rm ./srcs/.env.bak