from datetime import date
from .models import Event, Player


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


# placeholder to empty token table of very expired tokens
def purge_tokens():
    # get all tokens in token table
    # if token.created is older than x
    # delete
    pass
