import numpy
from django.test import TestCase
from . import grids
from . import models
from datetime import datetime


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
        out = grids.sub_sample(([52.285296, -1.549612], [52.289372, -1.530621]))
        self.assertEqual(len(out), 7)

    def test_sub_sample_windowing(self):
        out = grids.sub_sample(([52.285296, -1.549612], [52.289372, -1.530621]), 2)
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
        out = grids.sub_sample(([52.285951, -1.5329989], [52.286022, -1.5328809]), sub_dimension=4)
        print(str(out))
