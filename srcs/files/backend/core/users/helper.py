from django.contrib.auth.hashers import check_password

from users.models import User


def authenticate(request=None, username=None, password=None, verify=None):

	# Your authentication logic here...username=None, password=None):
	#	if request is not None:
	# 	username = request.data.get('username')
	# 	password = request.data.get('password')
	print('username in authenticate custom function', username)
	print('password in authenticate custom function', password)
	try:
		# Get the corresponding user.
		user = User.objects.get(username=username)
		#  If password, matches just return the user. Otherwise, return None.
		if check_password(password, user.password):
			return user
		return None
	except User.DoesNotExist:
		return None
		# No user was found.

def  listUsers():
	 #return list of authenticated users only...
	return User.objects.all()
	


# request.method: A string representing the HTTP method used in the request (e.g., 'GET', 'POST').
# request.GET: A dictionary-like object containing all given HTTP GET parameters.
# request.POST: A dictionary-like object containing all given HTTP POST parameters.
# request.FILES: A dictionary-like object containing all uploaded files.
# request.COOKIES: A standard Python dictionary containing all cookies.
# request.META: A standard Python dictionary containing all available HTTP headers. Available headers depend on the client and server, but here are some examples: HTTP_ACCEPT_ENCODING, HTTP_USER_AGENT, HTTP_HOST.
# request.path: A string representing the full path to the requested page, not including the scheme or domain.
# request.path_info: The path_info part of the path.
# request.scheme: A string representing the scheme of the request (http or https usually).
# request.body: The raw HTTP body as a byte string. This is useful for processing POST data.
# request.user: An instance of the User model representing the currently logged-in user. If the user isn’t logged in, this attribute will be set to an instance of AnonymousUser.