#get the param of the player
# if ere's a room number check if the room exist 
# if not create the room with the param

def create_room():
	name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
	while (Room.objects.filter(name=name).exists()):
		name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
	room = Room.objects.create(name=name)
	return room.name

def matchmaking(request):
	# get the user who want to join a game
	user = User.objects.get(id=request.GET['user_id'])
	# get the room number
	room_number = request.GET['room_number']
	if (room_number == None):
		room_number = create_room()
		add_user_to_room(user, room_number)
	if (room_number_is_valid(room_number) == False):
		return JsonResponse({'error': 'Room number is invalid'})
	# get the room
	room = Room.objects.get(name=room_number)
	# add the user to the room
	if (room.users.count() == room.max_capacity):
		return JsonResponse({'error': 'Room is full'})
	room.users.add(user)
	# check if the room is full
	if room.users.count() == room.max_capacity:
		# create the game
		game = Game.objects.create(room=room)
		# launch the game
		launch_tournament(game)
		# return the game
		return JsonResponse({'game_id': game.id})
	# return the room
	return JsonResponse({'room_id': room.id})