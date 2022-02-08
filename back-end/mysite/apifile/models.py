import math
import operator
from functools import reduce

from django.db.models import Q, Count, F, Func
from django.db.models.functions import Cast
from shapely.geometry import Point, Polygon

from .constants import UNIT_TILE_SIZE
import mahotas
import numpy as np
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


class Grid(models.Model):
    easting = models.PositiveIntegerField()
    northing = models.PositiveIntegerField()
    time = models.DateTimeField()
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    published = models.BooleanField(default=False)

    class Meta:
        unique_together = (("easting", "northing"),)

    def check_tile_override(self, date_time):
        if self.time < date_time:
            return True
        else:
            return False


class Event(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    players = models.ManyToManyField(Player, through='EventPerformance')

    @staticmethod
    def get_closest_event(point):
        return Event.objects.all().annotate(
            distance=((Cast(F('eventbounds__easting'), output_field=models.IntegerField())
                       - point[0]) ** 2
                      + (Cast(F('eventbounds__northing'), output_field=models.IntegerField())
                         - point[1]) ** 2)).order_by('distance').first()

    @staticmethod
    def get_events_in_distance(centre, dist):
        centre_easting, centre_northing = centre
        lower_easting = centre_easting - dist
        lower_northing = centre_northing - dist
        upper_easting = centre_easting + dist
        upper_northing = centre_northing + dist

        events = Event.get_current_events()
        events = events.filter(eventbounds__easting__gte=lower_easting,
                               eventbounds__northing__gte=lower_northing,
                               eventbounds__easting__lte=upper_easting,
                               eventbounds__northing__lte=upper_northing).distinct()

        closest_event = Event.get_closest_event(centre)
        if closest_event.check_within(centre):
            events = events.union(Event.objects.filter(id=closest_event.id))
        return events

    @staticmethod
    def get_current_events():
        today = timezone.now()
        curr_events = Event.objects.filter(start__lte=today, end__gte=today)

        return curr_events

    def check_within(self, point):
        """
        Input: list of events, point to test if inside an event polygon. Assumes no events overlap.
        Output: If point is in an event then that event otherwise None.

        """
        point = (point[0] + (UNIT_TILE_SIZE / 2), point[1] + (UNIT_TILE_SIZE / 2))
        point = Point(point)
        bounds = self.get_bounds()
        polygon = Polygon(bounds)
        return polygon.contains(point)

    def get_bounds(self):
        bounds = EventBounds.objects.filter(event_id=self.id).order_by('id')
        bounds_list = []
        for bound in bounds:
            bounds_list.append((bound.easting, bound.northing))
        return bounds_list

    def all_grids(self):
        """
        Input: Event object
        Output: List of all grids in the event.
        """
        bounds = self.get_bounds()

        # Subtract each bound by half of unit tile rounded (needs to be int to work) to get "center"
        # Translating the bounds to be in the "center" coordinate space instead of bottom left of each grid.
        for i in range(len(bounds)):
            bounds[i] = (bounds[i][0] - math.ceil(UNIT_TILE_SIZE / 2), bounds[i][1] - math.ceil(UNIT_TILE_SIZE / 2))

        xs, ys = zip(*bounds)

        # create a copy of the polygon translated to the origin.
        minx, maxx = min(xs), max(xs)
        miny, maxy = min(ys), max(ys)
        newPoly = [(x - minx, y - miny) for (x, y) in bounds]

        # Create a grid to flood fill.
        # https://stackoverflow.com/questions/21339448/how-to-get-list-of-points-inside-a-polygon-in-python
        X = maxx - minx + 1
        Y = maxy - miny + 1
        grid = np.zeros((X, Y), dtype=np.int8)
        mahotas.polygon.fill_polygon(newPoly, grid)  # 1 if inside polygon 0 if not.

        # https://www.desmos.com/calculator/y3jwlc86vq
        # Retranslate the polygon back to original location and ensure that each grid is a unit tile size.
        grids = [(x + minx - 1, y + miny) for (x, y) in zip(*np.nonzero(grid)) if
                 ((x + minx - 1) % UNIT_TILE_SIZE == 0 and (y + miny) % UNIT_TILE_SIZE == 0)]
        return grids

    def clear_area(self):
        """
        Input: event to clear grids in
        Output: None, deletes grids within event.
        """
        all_grids = self.all_grids()
        if all_grids is not None:
            Grid.objects.filter(reduce(operator.or_, (Q(easting=i, northing=j) for i, j in all_grids))).delete()
        return None

    def winner(self):
        """
        Input: Event object
        Output: count the number of grids within event per team. ***Descending order***
        """

        all_grids = self.all_grids()
        if all_grids is not None:
            grids = Grid.objects.filter(reduce(operator.or_, (Q(easting=i, northing=j) for i, j in all_grids)))
            return grids.values('player__team').annotate(total=Count('player__team')).order_by('-total')

    def center(self):
        """
        Input: Tuple of coordinates for polygon
        Output: Center of polygon coordinates
        """
        poly_bounds = Polygon(self.get_bounds())
        return poly_bounds.centroid.x, poly_bounds.centroid.y


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
