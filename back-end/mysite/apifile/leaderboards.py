

from django.db.models import Q
from .models import Workout,WorkoutPoint,Player

def distance_leaderboard(time_range):
    
    #get all workout points greater than the input time.
    workout_points = WorkoutPoint.objects.filter(time__gt=time_range)