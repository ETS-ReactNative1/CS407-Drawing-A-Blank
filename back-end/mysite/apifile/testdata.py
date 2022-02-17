from .models import Workout, WorkoutPoint, Player
from django.db.models import Count

def fill_points():
    workouts =  Workout.objects.all()

    for w in workouts:
        player = Player.objects.filter(user=workouts.player)
        # not correct, using number of gps points sent instead of grids (dummy data)
        w.points = player.values('user__username').annotate(points=Count('workout__workoutpoints')).order_by('-points')