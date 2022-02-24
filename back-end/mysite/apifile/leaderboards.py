from .models import Workout, Player, User
from . import grids, stats
from django.db.models import Q


def distance_leaderboard(time_range, teams):
    workouts = None
    players = None

    # Get all players/workouts from all teams
    if teams is None or teams == []:
        players = Player.objects.all()
        workouts = Workout.objects.filter(workoutpoint__time__gt=time_range).distinct()
    # Filter for teams in list.
    else:
        players = Player.objects.filter(team__name__in=teams)
        workouts = Workout.objects.filter(
            Q(workoutpoint__time__gt=time_range) & Q(player__team__name__in=teams)).distinct()

    # initialize the dictionary/hashmap.
    dist_leaderboard = {}
    for player in players:
        dist_leaderboard[player.user.username] = {"team" : player.team.name, "score": 0.0}

    #go through all workouts.
    for workout in workouts:
        dist_leaderboard[workout.player.user.username]["score"] += stats.calc_workout_distance(workout)

    # sort distance dictionary
    sorted_dict = {k: v for k, v in sorted(dist_leaderboard.items(), key=lambda item: item[1]["score"], reverse=True)}

    #update format to an array of dicts.
    return_array = []
    for key, value in sorted_dict.items():
        dict_cur = {}
        dict_cur["name"] = str(key)
        dict_cur["team"] = value["team"]
        dict_cur["score"] = value["score"]
        return_array.append(dict_cur)
    return return_array

