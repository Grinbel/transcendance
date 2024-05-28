import keyboard  # Assurez-vous d'avoir installé le module keyboard via pip (pip install keyboard)

def on_key_press(event):
    print("Touche appuyée :", event.name)

keyboard.on_press(on_key_press)

input("Appuyez sur Entrée pour arrêter le programme...")

