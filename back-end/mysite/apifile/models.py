from django.db import models
from django.contrib.auth.models import User
from datetime import date


# 'python manage.py makemigrations' 'python manage.py migrate'
# run in terminal after changing/making new model, then register in admin.py

class Team(models.Model):
    name = models.CharField(max_length=10, unique=True)
    colour = models.CharField(max_length=6)  # hex colour

    def get_colour():
        retval = Team.objects.filter(id=1)[0].colour

        return retval


class Grid(models.Model):
    easting = models.PositiveIntegerField()
    northing = models.PositiveIntegerField()
    time = models.DateTimeField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    published = models.BooleanField(default=False)

    class Meta:
        unique_together = (("easting", "northing"),)

    def check_tile_override(self, date_time):
        if self.time < date_time:
            return True
        else:
            return False


class Item(models.Model):
    asset = models.FilePathField(path="items/asset")  # temp file paths
    thumbnail = models.FilePathField(path="items/thumbnail")  # temp file paths
    type = models.CharField(max_length=10)
    price = models.PositiveIntegerField()


class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    users = models.ManyToManyField(User, through='EventPerformance')

    @staticmethod
    def get_current_events():
        today = date.today()
        curr_events = Event.objects.filter(start__lte=today, end__gte=today)

        return curr_events


class EventBounds(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    easting = models.PositiveIntegerField()
    northing = models.PositiveIntegerField()

    def get_bound(event_id):
        bounds = EventBounds.objects.filter(id = event_id).bound

        return bounds


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
    easting = models.PositiveIntegerField()
    northing = models.PositiveIntegerField()


class EventPerformance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    contribution = models.PositiveIntegerField()  # work out what we want to track when we develop events further
