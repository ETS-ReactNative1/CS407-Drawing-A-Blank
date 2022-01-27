import numpy
from django.test import TestCase
from . import grids
from . import models
from . import events
from .models import Event, EventBounds
import datetime
from django.db.models import Q
from functools import reduce
import operator
"""
# Create your tests here.
class GridTestCase(TestCase):
    def setUp(self):
        team = models.Team.objects.create(name="Test Team1", colour="FF0000")
        team2 = models.Team.objects.create(name="Test Team2", colour="00FF00")
        models.Grid.objects.create(easting="431890", northing="265590", team=team, time=datetime.now())
        models.Grid.objects.create(easting="431890", northing="265595", team=team2, time=datetime.now())
        models.Grid.objects.create(easting="432315", northing="265865", team=team, time=datetime.now())
        models.Grid.objects.create(easting="431930", northing="265510", team=team, time=datetime.now())
        models.Grid.objects.create(easting="432360", northing="265780", team=team, time=datetime.now())
        models.Grid.objects.create(easting="431255", northing="265590", team=team, time=datetime.now())
        models.Grid.objects.create(easting="430950", northing="265555", team=team, time=datetime.now())
        models.Grid.objects.create(easting="430985", northing="265460", team=team, time=datetime.now())
        models.Grid.objects.create(easting="431255", northing="265430", team=team, time=datetime.now())

    def test_grid_windowing(self):
        out = grids.sub_sample([[52.285296, -1.549612], [0, 0], [52.289372, -1.530621], [0, 0]])
        self.assertEqual(len(out), 7)

    def test_sub_sample_windowing(self):
        out = grids.sub_sample([[52.285296, -1.549612], [0, 0], [52.289372, -1.530621], [0, 0]], 2)
        for row in out:
            print(str(row))
        self.assertEqual(len(out), 6)


class SubSampleTest(TestCase):
    def setUp(self):
        team = models.Team.objects.create(name="Test Team1", colour="FF0000")
        team2 = models.Team.objects.create(name="Test Team2", colour="00FF00")
        east = 431950
        north = 265410
        for i in range(0, 100, 5):
            if i % 3 == 0:
                current_team = team2
            else:
                current_team = team
            for j in range(0, 100, 5):
                models.Grid.objects.create(easting=str(east + i), northing=str(north + j), team=current_team,
                                           time=datetime.now())

    def test_sub(self):
        print("")
        # 8x8= 64 (1x1m) grids converted to a 2x2 grid with each grid being 4x4m
        out = grids.sub_sample([[52.285951, -1.5329989], [0, 0], [52.286022, -1.5328809], [0, 0]], sub_dimension=4)
        print(str(out))

"""


class eventBound(TestCase):
    def setUp(self):
        self.ev1 = Event.objects.create(start=datetime.datetime.now(),
                                end=datetime.datetime.now() + datetime.timedelta(days=50))
        EventBounds.objects.create(event=self.ev1, easting=400, northing=400)
        EventBounds.objects.create(event=self.ev1, easting=800, northing=400)
        EventBounds.objects.create(event=self.ev1, easting=800, northing=800)
        EventBounds.objects.create(event=self.ev1, easting=400, northing=800)


        #https://www.desmos.com/calculator/g2yl7eeczh 
        self.ev2 = Event.objects.create(start=datetime.datetime.now(),
                                end=datetime.datetime.now() + datetime.timedelta(days=50))
        EventBounds.objects.create(event=self.ev2, easting=100, northing=100)
        EventBounds.objects.create(event=self.ev2, easting=200, northing=100)
        EventBounds.objects.create(event=self.ev2, easting=200, northing=200)
        EventBounds.objects.create(event=self.ev2, easting=100, northing=200)
        EventBounds.objects.create(event=self.ev2, easting=100, northing=175)
        EventBounds.objects.create(event=self.ev2, easting=125, northing=175)
        EventBounds.objects.create(event=self.ev2, easting=125, northing=125)
        EventBounds.objects.create(event=self.ev2, easting=100, northing=125)

        self.ev3 = Event.objects.create(start=datetime.datetime.now(),
                                end=datetime.datetime.now() + datetime.timedelta(days=50))
        EventBounds.objects.create(event=self.ev3 , easting=10, northing=10)
        EventBounds.objects.create(event=self.ev3 , easting=20, northing=10)
        EventBounds.objects.create(event=self.ev3 , easting=20, northing=20)
        EventBounds.objects.create(event=self.ev3 , easting=10, northing=20)
        EventBounds.objects.create(event=self.ev3 , easting=10, northing=17)
        EventBounds.objects.create(event=self.ev3 , easting=12, northing=17)
        EventBounds.objects.create(event=self.ev3 , easting=12, northing=12)
        EventBounds.objects.create(event=self.ev3 , easting=10, northing=12)
        self.events_list = [self.ev1,self.ev2,self.ev3]

        models.Team.objects.create(name="Test Team1", colour="FF0000")
        models.Team.objects.create(name="Test Team2", colour="00FF00")
        team = models.Team.objects.get(name="Test Team1")
        team2 = models.Team.objects.get(name="Test Team2")
        models.Grid.objects.create(easting="15", northing="15", team=team,time=datetime.datetime.now())
        models.Grid.objects.create(easting="16", northing="16", team=team2,time=datetime.datetime.now())
        models.Grid.objects.create(easting="14", northing="14", team=team,time=datetime.datetime.now())
        models.Grid.objects.create(easting="21", northing="21", team=team,time=datetime.datetime.now())

    def test_bounds(self):
        self.assertEqual(events.check_within_event(self.events_list,(110,150)),None)
        self.assertEqual(events.check_within_event(self.events_list,(150,150)),self.ev2)
        self.assertEqual(events.check_within_event(self.events_list,(150,600)),None)
        self.assertEqual(events.check_within_event(self.events_list,(600,600)),self.ev1)

        test = events.all_grids_in_event(self.events_list[2])
        test2 = events.event_winner(self.events_list[2])
        print(test2)
        #a = models.Grid.objects.filter( reduce(operator.or_, (Q(easting=i, northing=j) for i,j in test)))
        
 