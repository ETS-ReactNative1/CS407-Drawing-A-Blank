from .models import Workout, Player, User, CoordsConvert
from . import grids
from django.db.models import Q, Sum


def all_user_workouts(input_name):
    workouts = Workout.objects.filter(player__user__username=input_name)
    ret_val = []
    for workout in workouts:
        workout_points = workout.workoutpoint_set.all()
        if len(workout_points) > 0:
            ret_val.append(
                {"id": workout.id, "date": workout_points[0].time.strftime("%Y-%m-%d"), "duration": workout.duration,
                 "calories": workout.calories, "type": workout.type, "distance": calc_workout_distance(workout),
                 "points": workout.points})

    return ret_val


def workoutpoints_details(workout_id, player):
    workout = Workout.objects.get(id=workout_id, player=player)
    workout_points = workout.workoutpoint_set.all()

    ret_val = []

    for point in workout_points:
        try:
            convert = CoordsConvert.objects.get(easting=point.easting, northing=point.northing)
            ret_val.append({"latitude": convert.latitude, "longitude": convert.longitude,
                            "time": point.time.strftime("%Y-%m-%dT%H:%M:%S")})
        except CoordsConvert.DoesNotExist:
            lat, long = grids.grid_to_latlong((point.easting, point.northing))
            ret_val.append({"latitude": lat, "longitude": long,
                            "time": point.time.strftime("%Y-%m-%dT%H:%M:%S")})
    return ret_val


def profile_info(input_name):
    player = Player.objects.get(user__username=input_name)
    return {"username": player.user.username, "dob": player.date_of_birth, "gender": player.gender,
            "height": player.height, "weight": player.weight, "team": player.team.name,
            "total_distance": user_total_distance(input_name), "total_points": user_total_points(input_name)}


def user_total_distance(input_name):
    workouts = Workout.objects.filter(player__user__username=input_name)

    total_distance = 0.0
    for workout in workouts:
        total_distance += calc_workout_distance(workout)

    return total_distance


def user_total_points(input_name):
    
    workouts = Player.objects.filter(user__username=input_name).annotate(points=Sum('workout__points'))
    
    # Workout.objects.values("player__user__username").filter(player__user__username=input_name).annotate(
    #     score=Sum('points'))
    test = []
    for w in workouts:
        test.append(w)
    if workouts.exists():
        return test
    else:
        return 0


def calc_workout_distance(input_workout):
    # get all the workoutpoints in the workout
    all_points = input_workout.workoutpoint_set.all()
    try:
        # calculate distance between each pair of adjacent points.
        cur_point = (all_points[0].easting, all_points[0].northing)
        dist = 0.0
        for point in all_points[1:]:
            dist += grids.distance(cur_point, (point.easting, point.northing))
            cur_point = (point.easting, point.northing)
        return dist
    except:
        return 0
