import numpy
from django.test import TestCase
from . import grids
from . import models


# Create your tests here.
class GridTestCase(TestCase):
    def setUp(self):
        models.Team.objects.create(name="Test Team1", colour="FF0000")
        models.Team.objects.create(name="Test Team2", colour="00FF00")
        team = models.Team.objects.get(name="Test Team1")
        team2 = models.Team.objects.get(name="Test Team2")
        models.Grid.objects.create(easting="431890", northing="265592", team=team)
        models.Grid.objects.create(easting="431890", northing="265593", team=team2)
        models.Grid.objects.create(easting="432315", northing="265866", team=team)
        models.Grid.objects.create(easting="431932", northing="265511", team=team)
        models.Grid.objects.create(easting="432360", northing="265781", team=team)
        models.Grid.objects.create(easting="431258", northing="265593", team=team)
        models.Grid.objects.create(easting="430952", northing="265558", team=team)
        models.Grid.objects.create(easting="430986", northing="265463", team=team)
        models.Grid.objects.create(easting="431259", northing="265432", team=team)

    def test_grid_windowing(self):
        out = grids.grids_visible([[52.285296, -1.549612], [0, 0], [52.289372, -1.530621], [0, 0]])
        for row in out:
            print(str(row))
        self.assertEqual(len(out), 7)

    def test_complex_grid_windowing(self):
        # Should only be a single element in the window
        out = grids.grids_visible_alt([[52.287527437165934, -1.5339205744787892], [0, 0],
                                       [52.28756310786077, -1.5338468986583116], [0, 0]])
        print(str(out)+"\n")
        # Check 2 elements output
        self.assertEqual(len(out), 2)
        # Check 1 colour output
        self.assertEqual(numpy.count_nonzero(out["colour"]), 2)
        # Check 8 coords output (4 x 2 coords)
        self.assertEqual(numpy.count_nonzero(out["bounds"]), 12)

    def test_super_sample_windowing(self):
        out = grids.super_sample_alt([[52.285296, -1.549612], [0, 0], [52.289372, -1.530621], [0, 0]], 2)
        for row in out:
            print(str(row))
        self.assertEqual(len(out), 6)


class SuperSampleTest(TestCase):
    def setUp(self):
        models.Team.objects.create(name="Test Team1", colour="FF0000")
        models.Team.objects.create(name="Test Team2", colour="00FF00")
        team = models.Team.objects.get(name="Test Team1")
        team2 = models.Team.objects.get(name="Test Team2")
        east = 431950
        north = 265410
        teams = [team, team2]
        for i in range(20):
            if i % 3 == 0:
                current_team = team2
            else:
                current_team = team
            for j in range(20):
                models.Grid.objects.create(easting=str(east + i), northing=str(north + j), team=current_team)

    def test_super(self):
        print("")
        # 8x8= 64 (1x1m) grids converted to a 2x2 grid with each grid being 4x4m
        out = grids.super_sample([[52.285951, -1.5329989], [0, 0], [52.286022, -1.5328809], [0, 0]], zoom_level=4)
        print(str(out))
