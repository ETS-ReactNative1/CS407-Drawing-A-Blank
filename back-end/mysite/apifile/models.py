from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# 'python manage.py makemigrations' 'python manage.py migrate'
# run in terminal after changing/making new model, then register in admin.py

class CoordsConvert(models.Model):
    easting = models.PositiveIntegerField()
    northing = models.PositiveIntegerField()
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        unique_together = (("easting", "northing"), ("latitude", "longitude"),)


class Team(models.Model):
    name = models.CharField(max_length=10, unique=True)
    colour = models.CharField(max_length=6)  # hex colour


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


# alter the base django user table with extra fields
class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField(null=True)
    gender = models.CharField(max_length=16, blank=True)
    height = models.FloatField(null=True)
    weight = models.FloatField(null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item)


class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    players = models.ManyToManyField(Player, through='EventPerformance')

    @staticmethod
    def get_events_in_distance(centre, r):
        centre_easting, centre_northing = centre
        lower_easting = centre_easting - r
        lower_northing = centre_northing - r
        upper_easting = centre_easting + r
        upper_northing = centre_northing + r

        events = Event.get_current_events()
        events = events.filter(eventbounds__easting__gte=lower_easting,
                               eventbounds__northing__gte=lower_northing,
                               eventbounds__easting__lte=upper_easting,
                               eventbounds__northing__lte=upper_northing)
        return events

    @staticmethod
    def get_current_events():
        today = timezone.now()
        curr_events = Event.objects.filter(start__lte=today, end__gte=today)

        return curr_events

    def get_bounds(self):
        bounds = EventBounds.objects.filter(event_id=self.id).order_by('id')
        bounds_list = []
        for bound in bounds:
            bounds_list.append((bound.easting, bound.northing))
        return bounds_list


class EventBounds(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    easting = models.PositiveIntegerField()
    northing = models.PositiveIntegerField()


class Workout(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    duration = models.PositiveIntegerField()  # in seconds
    calories = models.PositiveIntegerField()
    type = models.CharField(max_length=10)  # e.g. walk, run


class WorkoutPoint(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    time = models.DateTimeField()
    easting = models.PositiveIntegerField()
    northing = models.PositiveIntegerField()


class EventPerformance(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    contribution = models.PositiveIntegerField()  # work out what we want to track when we develop events further
