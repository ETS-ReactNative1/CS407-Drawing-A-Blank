from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions
import datetime

class ExpTokenAuthentication(TokenAuthentication):

    def authenticate_credentials(self, key):
        model = self.get_model()

        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))

        # if token expired, raise error
        # currently set to 5 minute expiry for testing
        if token.created < datetime.datetime.utcnow - datetime.timedelta(minutes=5):
            raise exceptions.AuthenticationFailed(_('Token expired'))

        return (token.user, token)