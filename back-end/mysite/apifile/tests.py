from django.test import TestCase
from . import grids
from . import models


# Create your tests here.
class GridTestCase(TestCase):
    def setUp(self):
        models.Team.objects.create(name="Test Team", colour="FF0000")
        models.Grid.objects.create(easting="431890", northing="265592", team=1)
        models.Grid.objects.create(easting="432315", northing="265866", team=1)
        models.Grid.objects.create(easting="431932", northing="265511", team=1)
        models.Grid.objects.create(easting="432360", northing="265781", team=1)
        models.Grid.objects.create(easting="431258", northing="265593", team=1)
        models.Grid.objects.create(easting="430952", northing="265558", team=1)
        models.Grid.objects.create(easting="430986", northing="265463", team=1)
        models.Grid.objects.create(easting="431259", northing="265432", team=1)

    def test_screen_return(self):

