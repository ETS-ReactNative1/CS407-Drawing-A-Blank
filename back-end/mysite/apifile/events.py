from .models import Event, EventBounds, Grid
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from shapely import wkt
import mahotas
import numpy as np
from django.db.models import Q, Count
from functools import reduce
import operator
import math
from .constants import UNIT_TILE_SIZE

def event_center(bounds):
    """
    Input: Tuple of coordinates for polygon
    Output: Center of polygon coordinates
    """    
    poly_bounds = Polygon(bounds)
    return (poly_bounds.centroid.x,poly_bounds.centroid.y)



def all_grids_in_event(event):
    bounds = event.get_bounds()
    for i in range(len(bounds)):
        bounds[i] = (bounds[i][0]-math.ceil(UNIT_TILE_SIZE/2),bounds[i][1]-math.ceil(UNIT_TILE_SIZE/2))

    xs, ys = zip(*bounds)
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)

    newPoly = [(x - minx, y - miny) for (x, y) in bounds]

    X = maxx - minx + 1
    Y = maxy - miny + 1

    # https://stackoverflow.com/questions/21339448/how-to-get-list-of-points-inside-a-polygon-in-python
    grid = np.zeros((X, Y), dtype=np.int8)
    mahotas.polygon.fill_polygon(newPoly, grid)

    # https://www.desmos.com/calculator/y3jwlc86vq
    grids =[(x + minx - 1, y + miny) for (x, y) in zip(*np.nonzero(grid)) if ((x + minx - 1)%UNIT_TILE_SIZE==0 and ( y + miny)%UNIT_TILE_SIZE==0)]
    return grids



def clear_event_grids(event):
    """
    Input: event to clear grids in
    Output: None, deletes grids within event.
    """
    bounds = all_grids_in_event(event)
    Grid.objects.filter(reduce(operator.or_, (Q(easting=i, northing=j) for i, j in bounds))).delete()
    return None


def event_winner(event):
    """
    Input: Event object
    Output: count the number of grids within event per team. ***Descending order*** 
    """

    bounds = all_grids_in_event(event)
    if(bounds is not None):
        grids = Grid.objects.filter(reduce(operator.or_, (Q(easting=i, northing=j) for i, j in bounds)))
        return grids.values('team').annotate(total=Count('team')).order_by('-total')

    return None


def check_within_event(events, point):
    """
    Input: list of events, point to test if inside an event polygon. Assumes no events overlap.
    Output: If point is in an event then that event otherwise None.

    """
    point = Point(point)
    for event in events:
        bounds = event.get_bounds()
        polygon = Polygon(bounds)
        if polygon.contains(point):
            return event

    return None
