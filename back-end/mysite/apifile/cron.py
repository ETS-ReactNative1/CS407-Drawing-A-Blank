from datetime import date
from .models import Event, Player, User
import random
import datetime
import pytz

from . import authentication


def event_check_today():
    event_check(date.today())


def event_check(check_date):
    # check for events to start
    Event.open_events(check_date)
    # check for events to close
    Event.close_events(check_date)


def test_cron():
    p = Player.objects.get(id=1)
    p.coins += 1
    p.save()

# empty token table of very expired tokens
def purge_tokens():
    # get all tokens in token table
    # if token.created is older than x
    # delete
    
    tokens = authentication.ExpTokenAuthentication().get_model().objects.all()

    utc=pytz.UTC
    time_now = utc.localize(datetime.datetime.utcnow()) 

    # delete any 7 day old unused tokens
    for token in tokens:
        if token.created < time_now - datetime.timedelta(days=7):
                token.delete()
                token.save()

# testing case, cron job adds a user to db
def test():
    username = "crontest" + str(random.randint(0,10000000))
    password = "crontest"
    email = "cron@test.com"
    team = 'terra'

    user = User.objects.create_user(username, email, password)

