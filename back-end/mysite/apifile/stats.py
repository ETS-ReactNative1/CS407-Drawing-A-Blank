from .models import Workout, Player,User
from . import grids
from django.db.models import Q, Sum


def profile_info(input_name):
    player = Player.objects.get(user__username=input_name)
    
    ret_val = {}
    ret_val["username"] = player.user.username
    ret_val["dob"] =player.date_of_birth
    ret_val["gender"] = player.gender
    ret_val["height"] =player.height
    ret_val["weight"] =player.weight
    ret_val["team"] = player.team.name
    ret_val["total_distance"] = user_total_distance(input_name)
    ret_val["total_points"] = user_total_points(input_name)
    return ret_val


def user_total_distance(input_name):

    workouts = Workout.objects.filter(player__user__username=input_name)

    total_distance = 0.0
    for workout in workouts:
        total_distance+= calc_workout_distance(workout)
    
    return total_distance

def user_total_points(input_name):

    workouts = Workout.objects.filter(player__user__username=input_name).annotate(score=Sum('points'))

    return workouts[1].score


def calc_workout_distance(input_workout):
    #get all the workoutpoints in the workout
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


def calories_burned_run(bodymass, avg_speed, time_secs):

    #https://www.desmos.com/calculator/sruqcotkrt using mets data to determine mets ~=~ X * m/s 
    mets = avg_speed*3.452
    return mets*bodymass*(time_secs/3600)

def calories_burned_cycle(bodymass, avg_speed, time_secs):
   #https://www.desmos.com/calculator/qtmbovtlg5
    mets = avg_speed*1.459
    return mets*bodymass*(time_secs/3600)
"""
