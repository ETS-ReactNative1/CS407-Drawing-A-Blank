from datetime import date, timedelta
from .models import Event, Team, EventStandings, EventPerformance, User
import random


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
        # get winners
        winners = event.winners()
        unseen_teams = {"terra", "ocean", "windy"}
        teams = {"terra": Team.objects.get(name="terra"),
                 "ocean": Team.objects.get(name="ocean"),
                 "windy": Team.objects.get(name="windy")}

        if len(winners) == 3:
            first = teams[winners[0].name]
            second = teams[winners[1].name]
            third = teams[winners[2].name]
        elif len(winners) == 2:
            first = teams[winners[0].name]
            unseen_teams.remove(winners[0].name)
            second = teams[winners[1].name]
            unseen_teams.remove(winners[1].name)
            third = teams[unseen_teams.pop()]
        elif len(winners) == 1:
            first = teams[winners[0].name]
            unseen_teams.remove(winners[0].name)
            second = teams[unseen_teams.pop()]
            third = teams[unseen_teams.pop()]
        else:
            first = teams[unseen_teams.pop()]
            second = teams[unseen_teams.pop()]
            third = teams[unseen_teams.pop()]

        EventStandings.objects.create(event=event, team=first, place=1)
        EventStandings.objects.create(event=event, team=second, place=2)
        EventStandings.objects.create(event=event, team=third, place=3)

        # rewards
        players = EventPerformance.objects.filter(event=event, player__team=first)
        for playerPerf in players:
            playerPerf.player.coins += 3 * playerPerf.contribution
            playerPerf.player.save()
        players = EventPerformance.objects.filter(event=event, player__team=second)
        for playerPerf in players:
            playerPerf.player.coins += 2 * playerPerf.contribution
            playerPerf.player.save()
        players = EventPerformance.objects.filter(event=event, player__team=third)
        for playerPerf in players:
            playerPerf.player.coins += playerPerf.contribution
            playerPerf.player.save()

        # clear area
        event.clear_area()


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

    # default_team_colours = {'terra': 'FF8C91', 'windy': '82FF8A', 'ocean': '47C4FF'}
    # team, _ = Team.objects.get_or_create(name=team, defaults={'colour': default_team_colours[team]})

    # Player.objects.create(user=user, team=team)

    # token, _ = Token.objects.get_or_create(user=user)
