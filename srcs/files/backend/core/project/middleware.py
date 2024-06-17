from django.conf import settings
from django.http import HttpResponsePermanentRedirect

class SSLRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("SSLRedirectMiddleware: Received request", request.get_full_path())
        if not request.is_secure() and not settings.DEBUG:
            print("SSLRedirectMiddleware: Redirecting to HTTPS")
            url = request.build_absolute_uri(request.get_full_path())
            secure_url = url.replace("http://", "https://")
            # Ensure the port is correctly set to 8443
            if request.get_host().endswith(':8000'):
                secure_url = secure_url.replace(':8000', ':8443')
            return HttpResponsePermanentRedirect(secure_url)
        response = self.get_response(request)
        return response