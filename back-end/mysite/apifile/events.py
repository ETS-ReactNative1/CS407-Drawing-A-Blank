
from .models import Event, EventBounds, Grid
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import mahotas
import numpy as np
from django.db.models import Q,Count
from functools import reduce
import operator



UNIT_TILE_SIZE = 5
def all_grids_in_event(event):
    bounds = event.get_bounds()
    xs, ys = zip(*bounds)
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)

    newPoly = [(int(x - minx), int(y - miny)) for (x, y) in bounds]

    X = maxx - minx + 1
    Y = maxy - miny + 1

    #https://stackoverflow.com/questions/21339448/how-to-get-list-of-points-inside-a-polygon-in-python
    grid = np.zeros((X, Y), dtype=np.int8)
    mahotas.polygon.fill_polygon(newPoly, grid)

    #https://www.desmos.com/calculator/f5bqtsipez
    return [(x + minx-1, y + miny) for (x, y) in zip(*np.nonzero(grid)) ]


def clear_event_grids(event):
    """
    Input: event to clear grids in
    Output: None, deletes grids within event.
    """
    bounds = all_grids_in_event(event)
    Grid.objects.filter( reduce(operator.or_, (Q(easting=i, northing=j) for i,j in bounds))).delete()
    return None
    
    


def event_winner(event):
    """
    Input: Event object
    Output: count the number of grids within event per team. ***Descending order*** 
    """

    bounds = all_grids_in_event(event)
    grids = Grid.objects.filter( reduce(operator.or_, (Q(easting=i, northing=j) for i,j in bounds)))
    counts = grids.values('team').annotate(total=Count('team')).order_by('-total')


    return counts



def check_within_event(events, point):
    """
    Input: list of events, point to test if inside an event polygon. Assumes no events overlap.
    Output: If point is in an event then that event otherwise None.

    """
    point = Point(point)
    for event in events:
        bounds = event.get_bounds()
        polygon = Polygon(bounds)
        if(polygon.contains(point)):
            return event

    return None

