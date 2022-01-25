import operator
from functools import reduce
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.response import Response
from . import grids
from django.http import JsonResponse
from .models import Event, EventBounds, Workout, WorkoutPoint, Grid, Player, Team, CoordsConvert
import datetime
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authtoken.models import Token 
# for testing only
from django.views.decorators.csrf import csrf_exempt





# Create your views here.


# example query on data

# from .serializers import HeroSerializer
# from .models import Hero


# class HeroViewSet(viewsets.ModelViewSet):
#     queryset = Hero.objects.all().order_by('name')
#     serializer_class = HeroSerializer

class PlayerLocation(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,) # uncomment to make endpoints token only

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


"""class PlayerPath(viewsets.ViewSet):
    
    {
    "current_coords": [52.286849 , -1.5329895],
    "old_coords": [52.285951 , -1.5329989],
    "colour":  "red",
    "time_elapsed": 18
    }
    

    def create(self, request):
        playerInfo = request.data
        current_coords = playerInfo["current_coords"]
        old_coords = playerInfo["old_coords"]
        colour = playerInfo["colour"]
        time_elapsed = playerInfo["time_elapsed"]

        current_grid = grids.latlong_to_grid(current_coords)
        old_grid = grids.latlong_to_grid(old_coords)
        speed = grids.calculate_speed(current_grid, old_grid, time_elapsed)
        radius = grids.calculate_radius(speed)  # calculate radius depending on speed

        allGrids = grids.all_grids_with_path(old_grid, current_grid, radius)

        # update colour database.

        return Response(allGrids)"""


class LatlongsOfGrid(viewsets.ViewSet):

    # GET request: parameter = a grid coordinate, responds with the 4 coordinates.
    # get 4 coordinates of a grid for testing:
    # http://127.0.0.1:8000/gridsCoords/?grid=SP3003376262 enter a grid reference and you should get 4 coordinates.
    def list(self, request):
        # need to get actual grid + colour from database.
        grid = request.query_params.get("grid")
        if grid is None:
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


# test view to add events to db
def add_events(_):
    ev1 = Event.objects.create(start=datetime.datetime.now(),
                               end=datetime.datetime.now() + datetime.timedelta(days=50))
    ev2 = Event.objects.create(start=datetime.datetime.now() - datetime.timedelta(days=20),
                               end=datetime.datetime.now() + datetime.timedelta(days=20))
    EventBounds.objects.create(event=ev1, easting=431890, northing=265592)
    EventBounds.objects.create(event=ev1, easting=431932, northing=265511)
    EventBounds.objects.create(event=ev1, easting=432360, northing=265781)
    EventBounds.objects.create(event=ev1, easting=432315, northing=265866)
    EventBounds.objects.create(event=ev2, easting=431258, northing=265593)
    EventBounds.objects.create(event=ev2, easting=430952, northing=265558)
    EventBounds.objects.create(event=ev2, easting=430986, northing=265463)
    EventBounds.objects.create(event=ev2, easting=431259, northing=265432)
    return Response("events added")


class Events(viewsets.ViewSet):

    def list(self, _):
        ret_val = dict()
        events = Event.get_current_events()
        for event in events:
            bounds = event.get_bounds()
            for i in range(0, len(bounds)):
                bounds[i] = grids.grid_to_latlong(bounds[i])
            values = {
                'start': event.start,
                'end': event.end,
                'bounds': bounds
            }

            ret_val[event.id] = values

        return Response(ret_val)


@csrf_exempt
@api_view(["POST"])
def record_workout(request):
    if request.method == 'POST':
        data = request.data
        waypoints = data["coordinates"]
        start = data["start"][:-1]  # removes 'Z' in timestamp
        end = data["end"][:-1]
        workout_type = data["type"]
        username = data["uid"]
        player = Player.objects.get(user__username=username)

        # convert to seconds - look at what this is
        dur = datetime.datetime.strptime(end, '%Y-%m-%dT%H:%M:%S.%f') - datetime.datetime.strptime(start, '%Y-%m-%dT'
                                                                                                          '%H:%M:%S.%f')

        cals = calc_calories(type, dur)

        workout = Workout.objects.create(player=player, duration=dur.total_seconds(), calories=cals, type=workout_type)

        for entry in waypoints:
            latlong = (entry["latitude"], entry["longitude"])
            easting, northing = grids.latlong_to_grid(latlong)
            timestamp = datetime.datetime.strptime(entry["timestamp"][:-1], '%Y-%m-%dT%H:%M:%S.%f')
            WorkoutPoint.objects.create(workout=workout, time=timestamp, easting=easting, northing=northing)

        bounds = WorkoutPoint.objects.filter(workout=workout).order_by('id')
        team = workout.player.team
        for i in range(1, len(bounds)):
            speed = grids.calculate_speed((bounds[i].easting, bounds[i].northing),
                                          (bounds[i - 1].easting, bounds[i - 1].northing),
                                          (bounds[i].time - bounds[i - 1].time).total_seconds())
            # calculate radius depending on speed
            radius = grids.calculate_radius(speed)
            allGrids = grids.all_grids_with_path((bounds[i].easting, bounds[i].northing),
                                                 (bounds[i - 1].easting, bounds[i - 1].northing), radius)
            if len(allGrids) > 0:
                tiles = Grid.objects.filter(reduce(operator.or_, (Q(easting=e, northing=n) for e, n in allGrids)))
            else:
                tiles = []
            checkedTiles = set()
            for tile in tiles:
                checkedTiles.add((tile.easting, tile.northing))
                if tile.check_tile_override(bounds[i].time):
                    tile.team = team
                    tile.time = bounds[i].time
                    tile.save()
            for tile in allGrids - checkedTiles:
                Grid.objects.create(easting=tile[0], northing=tile[1], team=team, time=bounds[i].time)

        return Response("workout added")


class CreateUser(viewsets.ViewSet):
    # @csrf_exempt
    # @api_view(["POST"])
    def create(self, request):
        data = request.data
        username = data["username"]
        email = data["email"]
        password = data["password"]
        team = data["team"]

        if team != 'terra' or team != 'windy' or team != 'ocean':
            return Response("Invalid team selected")
        if User.objects.filter(email=email).exists():
            return Response("User with that email already exists")
        elif User.objects.filter(username=username).exists():
            return Response("User with that username already exists")

        user = User.objects.create_user(username, email, password)

        default_team_colours = {'terra': 'FF8C91', 'windy': '82FF8A', 'ocean': '47C4FF'}
        team = Team.objects.get_or_create(name=team, defaults={'colour': default_team_colours[team]})

        Player.objects.create(user=user, team=team)

        token = [{"token": Token.objects.get_or_create(user=user)}]

        return Response(token)

@csrf_exempt
@api_view(["POST"])
def authenticate_user(request):
    if request.method == "POST":
        data = request.data
        username = data["username"]
        password = data["password"]

        if authenticate(username=username, password=password) is not None:
            # TODO: return token instead of message
            return Response("User authenticated")
        else:
            return Response("Could not authenticate user")


@csrf_exempt
@api_view(["POST"])
def update_profile(request):
    if request.method == "POST":
        data = request.data
        # TODO: change getting username from request to get user from token
        #  lookup
        username = data["username"]
        old_password = data["old_password"]
        new_password = data["new_password"]
        first_name = data["first_name"]
        last_name = data["last_name"]
        age = data["age"]
        gender = data["gender"]
        height = data["height"]
        weight = data["weight"]

        user = authenticate(username=username, password=old_password)
        if user is not None:
            player = Player.objects.get(user=user)

            if new_password != "":
                user.set_password(new_password)
            if first_name != "":
                user.first_name = first_name
            if last_name != "":
                user.last_name = last_name
            user.save()

            if age != 0:
                player.age = age
            if gender != "":
                player.gender = gender
            if height != 0:
                player.height = height
            if weight != 0:
                player.weight = weight
            player.save()

            return Response("User details updated")
        else:
            return Response("Could not find user with given username, or password is incorrect")


def calc_calories(workout_type, dur):
    return 0


class GridView(viewsets.ViewSet):

    def create(self, request):
        data = request.data
        bl = data['bottom_left']
        br = data['bottom_right']
        tr = data['top_right']
        tl = data['top_left']
        zoom = data['zoom']

        allGrids = grids.sub_sample([bl, br, tr, tl], sub_dimension=zoom)
        return Response(allGrids)


@csrf_exempt
@api_view(["POST"])
def populate_convert(request):
    if request.method == "POST":
        coords = request.data
        lower = coords['bottom_left']
        upper = coords['top_right']

        lower_easting, lower_northing = grids.latlong_to_grid(lower)
        upper_easting, upper_northing = grids.latlong_to_grid(upper)

        for easting in range(lower_easting, upper_easting + 1):
            for northing in range(lower_northing, upper_northing + 1):
                if not(CoordsConvert.objects.filter(easting=easting, northing=northing).exists()):
                    latitude, longitude = grids.grid_to_latlong((easting, northing))
                    CoordsConvert.objects.create(easting=easting, northing=northing,
                                                 longitude=longitude, latitude=latitude)

        return Response("populated coordsconvert table")
    return Response("expected post")
