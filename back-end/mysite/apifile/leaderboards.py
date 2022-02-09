

from django.db.models import Q
from .models import Workout,WorkoutPoint,Player
import math

#def distance(point_a,point_b):

def distance_leaderboard(time_range):
    
    #get all workout points greater than the input time.
    workout_points = WorkoutPoint.objects.filter(time__gt=time_range)
    print(workout_points[0].workout.player_id)

    #initialize the dictionary.
    players = Player.objects.all()
    distance_leaderboard = {}
    for player in players:
        distance_leaderboard[player] =0.0



    #group workout points by their workout id (probably a better way to do this)
    workouts = []
    cur_workout = workout_points[0].workout
    cur_workout_points = []
    for point in workout_points:
        #new workout
        if(cur_workout!=point.workout):
            workouts.append(cur_workout_points)
            cur_workout_points=[]
            cur_workout =point.workout

        cur_workout_points.append(point)
    #add the last workout
    if(len(cur_workout_points)>0):
        workouts.append(cur_workout_points)


    #go through list of workouts and calculate distance per workout and add it to the respective player.
    for workout in workouts:
        dist = 0.0
        cur_point = (workout[0].easting,workout[0].northing)
        for point in workout[1:]:
            dist += distance(cur_point,(point.easting,point.northing))
            cur_point = (point.easting,point.northing)
        distance_leaderboard[workout[0].workout.player] +=dist


    return {k: v for k, v in sorted(distance_leaderboard.items(), key=lambda item: item[1],reverse=True)}


def distance(point_a,point_b):
    return math.sqrt((point_a[0]-point_b[0])**2 +(point_a[1]-point_b[1])**2 )