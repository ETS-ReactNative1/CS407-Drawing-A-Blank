from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _
import datetime
import pytz
from rest_framework.response import Response
from rest_framework import status

class ExpTokenAuthentication(TokenAuthentication):

    def authenticate_credentials(self, key):
        model = self.get_model()

        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            return Response("Invalid token", status.HTTP_403_FORBIDDEN)

        if not token.user.is_active:
            raise Response("'User inactive or deleted.", status.HTTP_403_FORBIDDEN)
       
        # localize datetime objects as cannot compare naive and aware
        # aka set to same timezone regardless of os clock
        utc=pytz.UTC
        time_now = utc.localize(datetime.datetime.utcnow()) 

        # if token expired, raise error
        # currently set to 1 day usage
        if token.created < time_now - datetime.timedelta(days=1):
            return Response("Expired token", status.HTTP_403_FORBIDDEN)

        return (token.user, token)