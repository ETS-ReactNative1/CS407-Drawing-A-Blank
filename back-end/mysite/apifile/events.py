
from .models import Event, EventBounds

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import mahotas
import numpy as np

#event clear
def clear_event_grids(event):
    grids = all_grids_in_event(event)


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

    #https://www.desmos.com/calculator/mb6ktvx1az
    return [(x + minx-1, y + miny) for (x, y) in zip(*np.nonzero(grid))]



#event winner




def check_within_event(events, point):
    """
    Input: list of events, point to test if inside an event polygon
    Output: If point is in an event then that event otherwise None.

    """


    point = Point(point)
    for event in events:
        bounds = event.get_bounds()
        polygon = Polygon(bounds)
        if(polygon.contains(point)):
            return event

    return None

