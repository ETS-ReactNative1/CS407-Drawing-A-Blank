import datetime
import operator
from functools import reduce

from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response

from . import leaderboards, stats, grids, authentication
from .models import Event, Workout, WorkoutPoint, Grid, Player, Team, EventBounds, EventPerformance, ReportGrids


class Events(viewsets.ViewSet):
    authentication_classes = [authentication.ExpTokenAuthentication]

    # only allow admins to create events
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request):
        data = request.data
        # get event details
        start = datetime.datetime.strptime(data['start_date'], '%d/%m/%Y')
        end = datetime.datetime.strptime(data['end_date'], '%d/%m/%Y')
        bounds = data['bounds']

        # create the event
        event = Event.objects.create(start=start, end=end)

        # create the event bounds
        for bound in bounds:
            easting, northing = grids.latlong_to_grid(bound)
            EventBounds.objects.create(event=event, easting=easting, northing=northing)

        return Response("Event added", status=status.HTTP_201_CREATED)

    # list all active events
    def list(self, _):
        events = Event.get_active_events()
        ret_val = self.event_list_to_json(events)

        return Response(ret_val, status=status.HTTP_200_OK)

    # list all events within a Manhattan distance of a point
    @action(methods=['get'], detail=False)
    def local(self, request):
        data = request.GET

        # get details of search
        point = [data["lat"], data["long"]]
        centre = grids.latlong_to_grid(point)
        dist = data["distance"]

        # get local events
        events = Event.get_events_within_distance(centre, dist)
        ret_val = self.event_list_to_json(events)

        return Response(ret_val, status=status.HTTP_200_OK)

    # get a user's event scores
    @action(methods=['get'], detail=False)
    def history(self, request):
        data = request.GET
        player = Player.objects.get(user=request.user)

        # check whether to filter date of events or get all events
        if 'date' in data:
            date = data['date']
            if date != '':
                date = datetime.datetime.strptime(date, '%d/%m/%Y')
        else:
            date = ''

        return Response(Event.event_scores(date, player), status=status.HTTP_200_OK)

    # convert a list of events to a returnable JSON format
    @staticmethod
    def event_list_to_json(events):
        ret_val = dict()
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
        return ret_val


class UserProfile(viewsets.ViewSet):
    authentication_classes = [authentication.ExpTokenAuthentication]

    # allow anyone to create a user
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # get the user's profile information
    def list(self, request):
        data = request.GET
        input_name = data["username"]
        ret_val = stats.profile_info(input_name)

        return Response(ret_val, status=status.HTTP_200_OK)

    # create a user
    def create(self, request):
        data = request.data
        username = data["username"]
        email = data["email"]
        password = data["password"]
        team = data["team"].lower()

        # check team selected is a valid team
        if team != "terra" and team != "windy" and team != "ocean":
            return Response("Invalid team selected", status=status.HTTP_409_CONFLICT)
        # check user with the given email doesn't exist
        if User.objects.filter(email=email).exists():
            return Response("User with that email already exists", status=status.HTTP_409_CONFLICT)
        # check the user with the given username doesn't exist
        elif User.objects.filter(username=username).exists():
            return Response("User with that username already exists", status=status.HTTP_409_CONFLICT)

        # create the user object
        user = User.objects.create_user(username, email, password)

        # get the team object the user wants to join
        default_team_colours = {'terra': 'FF8C91', 'windy': '82FF8A', 'ocean': '47C4FF'}
        team, _ = Team.objects.get_or_create(name=team, defaults={'colour': default_team_colours[team]})

        # create the player object by linking hte user to their team
        Player.objects.create(user=user, team=team)

        # generate a token for the user
        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

    # changes a user's profile information
    @action(methods=['patch'], detail=False)
    def change_details(self, request):
        data = request.data
        user = request.user

        player = Player.objects.get(user=user)

        # if a field has been passed in with the data, change the relevant database value to the provided value
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        user.save()

        if "date_of_birth" in data:
            player.date_of_birth = datetime.datetime.strptime(data["date_of_birth"], "%d/%m/%Y").date()
        if "gender" in data:
            player.gender = data["gender"]
        if "height" in data:
            player.height = float(data["height"])
        if "weight" in data:
            player.weight = float(data["weight"])
        player.save()

        return Response("User details updated", status=status.HTTP_200_OK)

    # changes the user's password
    @action(methods=['patch'], detail=False)
    def change_pass(self, request):
        data = request.data
        user = request.user

        user.set_password(data["new_password"])

        return Response("Password changed", status=status.HTTP_200_OK)

    # returns the total stats for a user
    @action(methods=['get'], detail=False)
    def stats(self, request):
        user = request.user

        points = stats.user_total_points(user.username)
        distance = stats.user_total_distance(user.username)

        ret_val = {
            "points": points,
            "distance": distance
        }

        return Response(ret_val, status=status.HTTP_200_OK)

    # deletes the user's account
    @action(methods=['delete'], detail=False)
    def delete(self, request):
        user = request.user
        user.delete()


class GridView(viewsets.ViewSet):
    authentication_classes = [authentication.ExpTokenAuthentication]
    permission_classes = [IsAuthenticated]

    # report a section of the map as offensive
    @action(methods=['post'], detail=False)
    def report(self, request):
        data = request.data
        user = request.user
        reasoning = data["reason"]
        coords = data["coordinates"]
        area = data["area"]
        east, north = grids.latlong_to_grid(coords)
        ReportGrids.objects.create(easting=east, northing=north, area=area, time=datetime.datetime.utcnow(),
                                   reported_by=user.username, reason=reasoning)
        return Response("Grids reported", status=status.HTTP_200_OK)

    # show map tiles within given bounds at given subsample rate
    def list(self, request):
        data = request.GET
        bl = data['bottom_left']
        tr = data['top_right']
        zoom = data['zoom']
        bl_lat, bl_long = bl.split(',')
        bl = [float(bl_lat), float(bl_long)]
        tr_lat, tr_long = tr.split(',')
        tr = [float(tr_lat), float(tr_long)]

        allGrids = grids.sub_sample((bl, tr), zoom)
        return Response(allGrids, status=status.HTTP_200_OK)


class WorkoutSubmission(viewsets.ViewSet):
    authentication_classes = [authentication.ExpTokenAuthentication]
    permission_classes = [IsAuthenticated]

    # record a workout
    def create(self, request):
        data = request.data
        user = request.user

        waypoints = data["coordinates"]
        start = data["start"][:-1]  # removes 'Z' in timestamp
        end = data["end"][:-1]
        workout_type = data["type"]

        # get teh player object
        player = Player.objects.get(user=user)

        # convert dates to seconds
        dur = datetime.datetime.strptime(end, '%Y-%m-%dT%H:%M:%S.%f') - datetime.datetime.strptime(start, '%Y-%m-%dT'
                                                                                                          '%H:%M:%S.%f')

        # create workout object
        workout = Workout.objects.create(player=player, duration=dur.total_seconds(), type=workout_type)

        # record each waypoint
        for entry in waypoints:
            # get the ghost flag
            ghost = not entry["isTracking"]
            # convert to east north and get timestamp
            easting, northing = grids.latlong_to_grid((entry["latitude"], entry["longitude"]))
            timestamp = datetime.datetime.strptime(entry["timestamp"][:-1], '%Y-%m-%dT%H:%M:%S.%f')
            # record workout point
            WorkoutPoint.objects.create(workout=workout, time=timestamp, easting=easting, northing=northing,
                                        ghost=ghost)

        # get the workoutpoints
        bounds = WorkoutPoint.objects.filter(workout=workout).order_by('id')
        # for each section of workout (i.e. the line between 2 adjacent points)
        for i in range(len(bounds) - 1, 0, -1):
            # calculate average speed between waypoints
            speed = grids.calculate_speed((bounds[i].easting, bounds[i].northing),
                                          (bounds[i - 1].easting, bounds[i - 1].northing),
                                          (bounds[i].time - bounds[i - 1].time).total_seconds())
            # calculate radius depending on speed
            radius = grids.calculate_radius(speed)
            # get the tiles which the user converts
            allGrids = grids.all_grids_with_path((bounds[i].easting, bounds[i].northing),
                                                 (bounds[i - 1].easting, bounds[i - 1].northing), radius)
            # get existing grids from the database
            if len(allGrids) > 0:
                tiles = Grid.objects.filter(reduce(operator.or_, (Q(easting=e, northing=n) for e, n in allGrids)))
            else:
                tiles = []

            # the points a workout is worth is equal to the number of tiles a user converted during it
            workout.points += len(tiles)

            # check whether details should be drawn on the map
            if not bounds[i].ghost and not bounds[i - 1].ghost:
                checkedTiles = set()

                # check each tile in the segment
                for tile in tiles:
                    # record that the tile is in the db
                    checkedTiles.add((tile.easting, tile.northing))
                    # check whether a tile should be overrided (only needs to be checked as submission time differs
                    # from time tile was converted)
                    if tile.check_tile_override(bounds[i].time):
                        tile.player = player
                        tile.time = bounds[i].time
                        tile.save()
                        WorkoutSubmission.add_participation(player, (tile.easting, tile.northing))
                for tile in allGrids - checkedTiles:
                    Grid.objects.create(easting=tile[0], northing=tile[1], player=player, time=bounds[i].time)
                    WorkoutSubmission.add_participation(player, tile)
        # store the calories burnt and update the database record
        workout.calories = stats.calories_total(player.weight, workout)
        workout.save()
        # reward player with coins for each tile they convert
        player.coins += workout.points
        player.save()
        return Response("Workout added", status=status.HTTP_201_CREATED)

    # return a list of the user's previous workouts
    @action(methods=['get'], detail=False)
    def history(self, request):
        data = request.GET
        request_user = data["username"]
        ret_val = stats.all_user_workouts(request_user)

        return Response(ret_val, status=status.HTTP_200_OK)

    # return the details for a specific workout
    def list(self, request):
        data = request.GET
        user = request.user

        workout_id = data["id"]
        ret_val = stats.workoutpoints_details(workout_id, user.player)

        return Response(ret_val, status=status.HTTP_200_OK)

    # add user participation to an event for this tile, if relevant
    @staticmethod
    def add_participation(player, tile):
        closest_event = Event.get_closest_active_event(tile)
        # check tile is contained within an event
        if closest_event.check_within(tile):
            event_perf, created = EventPerformance.objects.get_or_create(player=player, event=closest_event,
                                                                         defaults={'contribution': 1})
            # update contribution for existing record
            if not created:
                event_perf.contribution += 1
                event_perf.save()


class Leaderboard(viewsets.ViewSet):
    authentication_classes = [authentication.ExpTokenAuthentication]
    permission_classes = [IsAuthenticated]

    # get the points leaderboard
    @action(methods=['get'], detail=False)
    def points(self, request):
        team_names = request.GET.getlist('teams', [])
        time = datetime.datetime.strptime(request.GET.get('date', ''), "%d/%m/%Y").date()

        ret_val = Player.points(time, team_names)

        return Response(ret_val, status=status.HTTP_200_OK)

    # get the distance leaderboard
    @action(methods=['get'], detail=False)
    def distance(self, request):
        team_names = request.GET.getlist('teams', [])
        time = datetime.datetime.strptime(request.GET.get('date', ''), "%d/%m/%Y").date()

        ret_val = leaderboards.distance_leaderboard(time, team_names)

        return Response(ret_val, status=status.HTTP_200_OK)


class ObtainExpAuthToken(ObtainAuthToken):
    serializer_class = AuthTokenSerializer

    @classmethod
    def get_extra_actions(cls):
        return []

    def post(self, request, *args, **kwargs):
        # authenticates username + password
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # get the user and their current token if exists, or make new one if not exist
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)

            # if token fetched, refresh expiry
            if not created:
                token.created = datetime.datetime.utcnow()
                token.save()

            return Response({'token': token.key})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


obtain_exp_auth_token = ObtainExpAuthToken.as_view()


class VerifyToken(viewsets.ViewSet):
    authentication_classes = [authentication.ExpTokenAuthentication]
    permission_classes = [IsAuthenticated]

    @action(methods=['patch'], detail=False)
    def verify_token(self, request):
        user = request.user

        token = Token.objects.get(user=user)

        # if token not expired, refresh expiry
        token.created = datetime.datetime.utcnow()
        token.save()

        return Response('Token valid and refreshed', status=status.HTTP_200_OK)

    @action(methods=['delete'], detail=False)
    def log_out(self, request):
        user = request.user
        Token.objects.get(user=user).delete()

        return Response('User logged out', status=status.HTTP_200_OK)
