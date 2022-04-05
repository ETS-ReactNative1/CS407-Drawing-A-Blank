from django.db.models import Sum

from . import grids
from .models import Workout, Player, CoordsConvert


# get a list of all a user's workouts
def all_user_workouts(input_name):
    """
    Input: Username
    Output: {id, date, duration, calories, type(exercise), distance, points} for each workout.
    """

    # Get all workouts from a username
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


# get a list of all the workout points belonging to a workout
def workoutpoints_details(workout_id, player):
    # get a specific workout for a player
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


# get the statistics to display on a user's profile
def profile_info(input_name):
    player = Player.objects.get(user__username=input_name)
    return {"username": player.user.username, "dob": player.date_of_birth, "gender": player.gender,
            "height": player.height, "weight": player.weight, "team": player.team.name,
            "total_distance": user_total_distance(input_name), "total_points": user_total_points(input_name)}


# calculate the total distance a user has recorded workouts for
def user_total_distance(input_name):
    """
    Input: username
    Output: Total distance the user has travelled.
    """

    workouts = Workout.objects.filter(player__user__username=input_name)

    total_distance = 0.0
    for workout in workouts:
        total_distance += calc_workout_distance(workout)

    return total_distance


# calculate the total points a user has ever scored
def user_total_points(input_name):
    workouts = Workout.objects.values("player__user__username").filter(player__user__username=input_name).annotate(
        score=Sum('points'))

    if workouts.exists():
        return workouts[0]["score"]
    else:
        return 0


# calculate the distance a workout took place over
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


"""
Kcal ~= METS * bodyMassKg * timePerformingHours

METS = metabolic equivalents
https://sites.google.com/site/compendiumofphysicalactivities/Activity-Categories
https://golf.procon.org/met-values-for-800-activities/


METS calculated using linear regression on existing data to allow support for any speed, since the speeds submitted will be continuous rather than discrete values.
"""


# calculate the calories a user burnt during a workout
def calories_total(bodymass, input_workout):
    all_points = input_workout.workoutpoint_set.all()
    ex_type = input_workout.type
    try:
        # calculate distance between each pair of adjacent points.
        cur_point = (all_points[0].easting, all_points[0].northing)
        cur_time = all_points[0].time

        calories = 0.0

        for point in all_points[1:]:
            dist = grids.distance(cur_point, (point.easting, point.northing))
            time_secs = (point.time - cur_time).total_seconds()

            avg_speed = dist / time_secs

            calories += select_ex_type(bodymass, avg_speed, time_secs, ex_type)
            cur_time = point.time
            cur_point = (point.easting, point.northing)
        return calories
    except:
        return 0


# return the calories burnt for given exercise type
def select_ex_type(bodymass, avg_speed, time_secs, ex_type):
    if ex_type == "run":
        return calories_burned_run(bodymass, avg_speed, time_secs)
    elif ex_type == "cycle":
        return calories_burned_cycle(bodymass, avg_speed, time_secs)
    return calories_burned_run(bodymass, avg_speed, time_secs)


# return calories burned for a run
def calories_burned_run(bodymass, avg_speed, time_secs):
    # https://www.desmos.com/calculator/sruqcotkrt using mets data to determine mets ~=~ X * m/s
    mets = avg_speed * 3.452
    return mets * bodymass * (time_secs / 3600)


# return calories burned for cycling
def calories_burned_cycle(bodymass, avg_speed, time_secs):
    # https://www.desmos.com/calculator/qtmbovtlg5
    mets = avg_speed * 1.459
    return mets * bodymass * (time_secs / 3600)
