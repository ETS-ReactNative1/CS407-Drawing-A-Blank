import datetime
from datetime import date

import pytz

from . import authentication
from .models import Event


def event_check_today():
    event_check(date.today())


def event_check(check_date):
    # check for events to start
    Event.open_events(check_date)
    # check for events to close
    Event.close_events(check_date)


# empty token table of very expired tokens
def purge_tokens():
    # get all tokens in token table
    # if token.created is older than x
    # delete
    utc = pytz.UTC
    time_now = utc.localize(datetime.datetime.utcnow())

    authentication.ExpTokenAuthentication().get_model().objects.filter(
        created__lt=time_now-datetime.timedelta(days=1)).delete()

