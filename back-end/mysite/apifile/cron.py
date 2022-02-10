from datetime import date, timedelta
from .models import Event, Team, EventStandings, EventPerformance


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

        EventStandings.objects.create(event=event, first=first,
                                      second=second, third=third)
        # rewards
        players = EventPerformance.objects.select_related('player__team').filter(event=event)
        for playerPerf in players:
            if playerPerf.player.team.name == first.name:
                coins_gained = 3 * playerPerf.contribution
            elif playerPerf.player.team.name == second.name:
                coins_gained = 2 * playerPerf.contribution
            else:
                coins_gained = 1 * playerPerf.contribution
            playerPerf.player.coins += coins_gained
            playerPerf.player.save()
        # clear area
        event.clear_area()


# placeholder to empty token table of very expired tokens
def purge_tokens():
    # get all tokens in token table
    # if token.created is older than x
    # delete
    pass
