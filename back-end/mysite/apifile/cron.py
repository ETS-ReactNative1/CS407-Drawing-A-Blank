from .models import Player, Team
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import random

# placeholder for when events end
def event_end():
    # get all events
    # check if over (will already ended ones still be stored?)
    # if over call ending methods for that event id
    pass

# placeholder to empty token table of very expired tokens
def purge_tokens():
    # get all tokens in token table
    # if token.created is older than x
    # delete
    pass

# testing case, cron job adds a user to db
def test():
    username = "crontest" + str(random.randint(0,10000000))
    password = "crontest"
    email = "cron@test.com"
    team = 'terra'

    user = User.objects.create_user(username, email, password)

    default_team_colours = {'terra': 'FF8C91', 'windy': '82FF8A', 'ocean': '47C4FF'}
    team, _ = Team.objects.get_or_create(name=team, defaults={'colour': default_team_colours[team]})

    Player.objects.create(user=user, team=team)

    token, _ = Token.objects.get_or_create(user=user)