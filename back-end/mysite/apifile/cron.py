import datetime
from datetime import date

import pytz

from . import authentication
from .models import Event


# perform an event check with the current date
def event_check_today():
    event_check(date.today())


# perform an event check with a given date
def event_check(check_date):
    # check for events to start
    Event.open_events(check_date)
    # check for events to close
    Event.close_events(check_date)


# empty token table of very expired tokens
def purge_tokens():
    utc = pytz.UTC
    time_now = utc.localize(datetime.datetime.utcnow())

    # if token.created is older than 7 days, delete
    authentication.ExpTokenAuthentication().get_model().objects.filter(
        created__lt=time_now-datetime.timedelta(days=7)).delete()

