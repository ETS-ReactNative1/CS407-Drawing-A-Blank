from django.db import models
from django.contrib.auth.models import User


# 'python manage.py makemigrations' 'python manage.py migrate'
# run in terminal after changing/making new model, then register in admin.py

class Team(models.Model):
    name = models.CharField(max_length=10, unique=True)
    colour = models.CharField(max_length=6)  # hex colour

    def get_colour():
        retval = Team.objects.filter(id=1)[0].colour

        return retval


class Grid(models.Model):
    location = models.CharField(max_length=12, primary_key=True)  # bng ref
    time = models.DateTimeField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    published = models.BooleanField(default=False)


class Item(models.Model):
    asset = models.FilePathField(path="items/asset")  # temp file paths
    thumbnail = models.FilePathField(path="items/thumbnail")  # temp file paths
    type = models.CharField(max_length=10)
    price = models.PositiveIntegerField()


class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    users = models.ManyToManyField(User, through='EventPerformance')


class EventBounds(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    bound = models.CharField(max_length=12)  # bng ref


# alter the base django user table with extra fields
class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item)


class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duration = models.PositiveIntegerField()  # in seconds
    calories = models.PositiveIntegerField()
    type = models.CharField(max_length=10)  # e.g. walk, run


class WorkoutPoint(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    time = models.DateTimeField()
    location = models.CharField(max_length=12)  # bng ref


class EventPerformance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    contribution = models.PositiveIntegerField()  # work out what we want to track when we develop events further

