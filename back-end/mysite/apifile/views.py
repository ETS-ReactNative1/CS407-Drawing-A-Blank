from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from . import grids
from django.http import JsonResponse
from .models import Team, Event, EventBounds
from datetime import date


# Create your views here.


# example query on data

# from .serializers import HeroSerializer
# from .models import Hero


# class HeroViewSet(viewsets.ModelViewSet):
#     queryset = Hero.objects.all().order_by('name')
#     serializer_class = HeroSerializer

class PlayerLocation(viewsets.ViewSet):

    # Not a full implementation, mostly for testing.
    # Instead of responding with the grids, it should replace the entries in the database with your player's colour.
    # Might need the user to send their current + previous location to calculate speed + path.
    def create(self, request):
        playerInfo = request.data
        coords = playerInfo["coords"]
        colour = playerInfo["colour"]
        gridLoc = grids.latlong_to_grid(coords)

        radius = 4  # calculate radius depending on speed

        allGrids = grids.grids_in_radius(gridLoc, radius)

        # update colour database.

        return Response(allGrids)


class LatlongsOfGrid(viewsets.ViewSet):

    # GET request: parameter = a grid coordinate, responds with the 4 coordinates.
    # get 4 coordinates of a grid for testing:
    # http://127.0.0.1:8000/gridsCoords/?grid=SP3003376262 enter a grid reference and you should get 4 coordinates.
    def list(self, request):
        # need to get actual grid + colour from database.
        grid = request.query_params.get("grid")
        if (grid == None):
            return Response("need a grid reference, try: http://127.0.0.1:8000/gridsCoords/?grid=SP3195365415", 400)

        coords = grids.bounds_of_grid(grid)
        color = "red"  # get colour data from database
        jsonString = [
            {
                "colour": color,
                "coords": coords
            }
        ]
        return Response(jsonString)

    # post - receiving 4 coordinates => respond with all grids visible.
    # function works but quite slow especially if the bounding box is big.
    def create(self, request):
        coords = request.data[0]
        bl = coords['bottom_left']
        br = coords['bottom_right']
        tr = coords['top_right']
        tl = coords['top_left']

        allGrids = grids.grids_visible([bl, br, tr, tl])
        return Response(allGrids)


def current_events(self):
    ret_val = dict()
    events = Event.get_current_events()

    for event in events:
        bound = EventBounds.get_bound(event.id)

        values = {
            'start': event.start,
            'end': event.end,
            'northing': bound[0],
            'easting': bound[1]
        }

        ret_val[event.id] = values

    return JsonResponse(ret_val)