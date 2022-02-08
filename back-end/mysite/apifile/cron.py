from datetime import date, timedelta
from .models import Event


def event_check():
    today = date.today()
    yesterday = today - timedelta(days=1)
    tomorrow = today + timedelta(days=1)

    # check event starts
    to_start = Event.object.filter(start__gt=yesterday, end__lte=today)
    for event in to_start:
        # clear area
        event.clear_area()

    # check event ends
    to_end = Event.object.filter(start__gte=today, end__lt=tomorrow)
    for event in to_end:
        # store info
        # rewards
        # clear area
        event.clear_area()


# placeholder to empty token table of very expired tokens
def purge_tokens():
    # get all tokens in token table
    # if token.created is older than x
    # delete
    pass
