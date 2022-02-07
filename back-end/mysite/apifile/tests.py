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
        u1 = models.User.objects.create_user("u1", "u1", "u1")
        u2 = models.User.objects.create_user("u2", "u2", "u2")
        p1 = models.Player.objects.create(user=u1, team=team)
        p2 = models.Player.objects.create(user=u2, team=team2)
        models.Grid.objects.create(easting="431890", northing="265590", player=p1, time=datetime.now())
        models.Grid.objects.create(easting="431890", northing="265595", player=p2, time=datetime.now())
        models.Grid.objects.create(easting="432315", northing="265865", player=p1, time=datetime.now())
        models.Grid.objects.create(easting="431930", northing="265510", player=p1, time=datetime.now())
        models.Grid.objects.create(easting="432360", northing="265780", player=p1, time=datetime.now())
        models.Grid.objects.create(easting="431255", northing="265590", player=p1, time=datetime.now())
        models.Grid.objects.create(easting="430950", northing="265555", player=p1, time=datetime.now())
        models.Grid.objects.create(easting="430985", northing="265460", player=p1, time=datetime.now())
        models.Grid.objects.create(easting="431255", northing="265430", player=p1, time=datetime.now())

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
        u1 = models.User.objects.create_user("u1", "u1", "u1")
        u2 = models.User.objects.create_user("u2", "u2", "u2")
        p1 = models.Player.objects.create(user=u1, team=team)
        p2 = models.Player.objects.create(user=u2, team=team2)
        east = 431950
        north = 265410
        for i in range(0, 100, 5):
            if i % 3 == 0:
                current_player = p2
            else:
                current_player = p1
            for j in range(0, 100, 5):
                models.Grid.objects.create(easting=str(east + i), northing=str(north + j), player=current_player,
                                           time=datetime.now())

    def test_sub(self):
        print("")
        # 8x8= 64 (1x1m) grids converted to a 2x2 grid with each grid being 4x4m
        out = grids.sub_sample(([52.285951, -1.5329989], [52.286022, -1.5328809]), sub_dimension=4)
        print(str(out))
