

from django.db.models import Q
from .models import Workout,WorkoutPoint,Player
import math

def distance_leaderboard(time_range):
    #initialize the dictionary/hashmap.
    players = Player.objects.all()
    distance_leaderboard = {}
    for player in players:
        distance_leaderboard[player.user.username] =0.0



    workouts  =  Workout.objects.filter(workoutpoint__time__gt=time_range).distinct()



    for workout in workouts:

        #get all the workoutpoints in the workout
        all_points = workout.workoutpoint_set.all()

        #calculate distance between each pair of adjacent points.
        cur_point = (all_points[0].easting,all_points[0].northing)
        dist = 0.0
        for point in all_points[1:]:
            dist += distance(cur_point,(point.easting,point.northing))
            cur_point = (point.easting,point.northing)
        distance_leaderboard[workout.player.user.username] +=dist

    #sort distance dictionary and return.
    return {k: v for k, v in sorted(distance_leaderboard.items(), key=lambda item: item[1],reverse=True)}




"""
def distance_leaderboard(time_range):
    
    #get all workout points greater than the input time.
    workout_points = WorkoutPoint.objects.filter(time__gt=time_range)
    
    #initialize the dictionary/hashmap.
    players = Player.objects.all()
    distance_leaderboard = {}
    for player in players:
        distance_leaderboard[player] =0.0

    #group workout points by their workout id (probably a better way to do this)
    workouts_list = []
    cur_workout = workout_points[0].workout

    print(cur_workout.workoutpoint_set.all())
    cur_points = []
    for point in workout_points:
        #new workout
        if(cur_workout!=point.workout):
            workouts_list.append(cur_points)
            cur_points=[]
            cur_workout =point.workout

        cur_points.append(point)
    #add the last workout
    if(len(cur_points)>0):
        workouts_list.append(cur_points)


    #go through list of workouts and calculate distance per workout and add it to the respective player.
    for workout in workouts_list:
        dist = 0.0

        #go through all points in a workout and get the distance
        cur_point = (workout[0].easting,workout[0].northing)
        for point in workout[1:]:
            dist += distance(cur_point,(point.easting,point.northing))
            cur_point = (point.easting,point.northing)
        distance_leaderboard[workout[0].workout.player] +=dist

    #sort by distance. https://stackoverflow.com/questions/613183/how-do-i-sort-a-dictionary-by-value
    return {k: v for k, v in sorted(distance_leaderboard.items(), key=lambda item: item[1],reverse=True)}
"""

def distance(point_a,point_b):
    return math.sqrt((point_a[0]-point_b[0])**2 +(point_a[1]-point_b[1])**2 )