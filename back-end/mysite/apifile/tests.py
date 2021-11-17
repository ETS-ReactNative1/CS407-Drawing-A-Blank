import numpy
from django.test import TestCase
from . import grids
from . import models


# Create your tests here.
class GridTestCase(TestCase):
    def setUp(self):
        models.Team.objects.create(name="Test Team", colour="FF0000")
        team = models.Team.objects.get(name="Test Team")
        models.Grid.objects.create(easting="431890", northing="265592", team=team)
        models.Grid.objects.create(easting="431890", northing="265593", team=team)
        models.Grid.objects.create(easting="432315", northing="265866", team=team)
        models.Grid.objects.create(easting="431932", northing="265511", team=team)
        models.Grid.objects.create(easting="432360", northing="265781", team=team)
        models.Grid.objects.create(easting="431258", northing="265593", team=team)
        models.Grid.objects.create(easting="430952", northing="265558", team=team)
        models.Grid.objects.create(easting="430986", northing="265463", team=team)
        models.Grid.objects.create(easting="431259", northing="265432", team=team)

    def test_grid_windowing(self):
        out = grids.grids_visible([[52.285296, -1.549612], [0, 0], [52.289372, -1.530621], [0, 0]])
        print(str(out))
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
