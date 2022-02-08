import datetime
from django.test import TestCase
from . import models
from .models import Event, EventBounds


class EventBoundTests(TestCase):
    def setUp(self):
        # somewhat larger event to test performance
        self.ev1 = Event.objects.create(start=datetime.datetime.now(),
                                        end=datetime.datetime.now() + datetime.timedelta(days=50))
        EventBounds.objects.create(event=self.ev1, easting=400, northing=400)
        EventBounds.objects.create(event=self.ev1, easting=800, northing=400)
        EventBounds.objects.create(event=self.ev1, easting=800, northing=800)
        EventBounds.objects.create(event=self.ev1, easting=400, northing=800)

        # https://www.desmos.com/calculator/g2yl7eeczh
        # small area to test insideness with concave shapes.
        self.ev2 = Event.objects.create(start=datetime.datetime.now(),
                                        end=datetime.datetime.now() + datetime.timedelta(days=50))
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=1000)
        EventBounds.objects.create(event=self.ev2, easting=2000, northing=1000)
        EventBounds.objects.create(event=self.ev2, easting=2000, northing=2000)
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=2000)
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=1750)
        EventBounds.objects.create(event=self.ev2, easting=1250, northing=1750)
        EventBounds.objects.create(event=self.ev2, easting=1250, northing=1250)
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=1250)

        # small event to test counts
        self.ev3 = Event.objects.create(start=datetime.datetime.now(),
                                        end=datetime.datetime.now() + datetime.timedelta(days=50))
        test_points = [(100, 100), (100, 125), (75, 125), (75, 150), (100, 150), (100, 175), (25, 175), (25, 150), (50, 150),
                      (50, 125), (25, 125), (25, 100)]
        for i in test_points:
            EventBounds.objects.create(event=self.ev3, easting=i[0], northing=i[1])

        # events list to test if the function returns the correct event
        self.events_list = [self.ev1, self.ev2, self.ev3]

        # Teams for counts.
        models.Team.objects.create(name="Test Team1", colour="FF0000")
        models.Team.objects.create(name="Test Team2", colour="00FF00")
        team = models.Team.objects.get(name="Test Team1")
        team2 = models.Team.objects.get(name="Test Team2")

        models.Grid.objects.create(easting="75", northing="115", team=team, time=datetime.datetime.now())
        models.Grid.objects.create(easting="60", northing="150", team=team2, time=datetime.datetime.now())
        models.Grid.objects.create(easting="35", northing="160", team=team, time=datetime.datetime.now())
        models.Grid.objects.create(easting="250", northing="250", team=team,
                                   time=datetime.datetime.now())  # outside event

    def test_bounds(self):
        for event in self.events_list:
            self.assertEqual(event.check_within((110, 150)), False)
            self.assertEqual(event.check_within((150, 600)), False)
            if event == self.ev3:
                self.assertEqual(event.check_within((60, 120)), True)
            else:
                self.assertEqual(event.check_within((60, 120)), False)
            if event == self.ev2:
                self.assertEqual(event.check_within((1500, 1500)), True)
            else:
                self.assertEqual(event.check_within((1500, 1500)), False)

        test = self.events_list[2].all_grids()
        print(test)
        test2 = self.events_list[2].winner()
        print(test2)
        # a = models.Grid.objects.filter( reduce(operator.or_, (Q(easting=i, northing=j) for i,j in test)))

    def test_get_events_in_distance(self):
        self.assertEqual(len(Event.get_events_in_distance((1000, 1000), 200)), 2)
        self.assertEqual(len(Event.get_events_in_distance((300, 300), 300)), 2)
