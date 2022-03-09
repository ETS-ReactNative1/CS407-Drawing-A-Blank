from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _
import datetime
import pytz

class ExpTokenAuthentication(TokenAuthentication):

    def authenticate_credentials(self, key):
        model = self.get_model()

        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))
       
        # localise datetime objects as cannot compare naive and aware
        # aka set to same timezone regardless of os clock
        utc=pytz.UTC
        time_now = utc.localize(datetime.datetime.utcnow()) 

        # if token expired, raise error
        # currently set to 1 day usage
        if token.created < time_now - datetime.timedelta(days=1):
            raise exceptions.AuthenticationFailed(_('Token expired'))

        return (token.user, token)