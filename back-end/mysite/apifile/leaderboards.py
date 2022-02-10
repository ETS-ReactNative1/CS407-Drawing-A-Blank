from .models import Workout, Player
from . import grids


def distance_leaderboard(time_range):
    # initialize the dictionary/hashmap.
    players = Player.objects.all()
    dist_leaderboard = {}
    for player in players:
        dist_leaderboard[player.user.username] = 0.0

    workouts = Workout.objects.filter(workoutpoint__time__gt=time_range).distinct()

    for workout in workouts:

        # get all the workoutpoints in the workout
        all_points = workout.workoutpoint_set.all()

        # calculate distance between each pair of adjacent points.
        cur_point = (all_points[0].easting, all_points[0].northing)
        dist = 0.0
        for point in all_points[1:]:
            dist += grids.distance(cur_point, (point.easting, point.northing))
            cur_point = (point.easting, point.northing)
        dist_leaderboard[workout.player.user.username] += dist

    # sort distance dictionary and return.
    return {k: v for k, v in sorted(dist_leaderboard.items(), key=lambda item: item[1], reverse=True)}
