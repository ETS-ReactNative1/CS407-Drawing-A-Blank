
from .models import Event, EventBounds

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import mahotas
import numpy as np

#event clear



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

