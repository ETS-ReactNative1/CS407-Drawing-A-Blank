import datetime
import operator
from functools import reduce
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from . import leaderboards, stats, grids
from .models import Event, Workout, WorkoutPoint, Grid, Player, Team, EventBounds, EventPerformance


class EventView(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request):
        data = request.data
        start = datetime.datetime.strptime(data['start_date'], '%d/%m/%Y')
        end = datetime.datetime.strptime(data['end_date'], '%d/%m/%Y')
        bounds = data['bounds']

        event = Event.objects.create(start=start, end=end)

        for bound in bounds:
            easting, northing = grids.latlong_to_grid(bound)
            EventBounds.objects.create(event=event, easting=easting, northing=northing)

        return Response("Event added", status=status.HTTP_201_CREATED)

    def list(self, _):
        events = Event.get_current_events()
        ret_val = EventView.event_list_to_json(events)

        return Response(ret_val, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def local(self, request):
        data = request.GET

        point = [data["lat"], data["long"]]
        centre = grids.latlong_to_grid(point)
        dist = data["distance"]

        events = Event.get_events_within_distance(centre, dist)
        ret_val = EventView.event_list_to_json(events)

        return Response(ret_val, status=status.HTTP_200_OK)

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
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request):
        data = request.GET
        input_name = data["username"]
        ret_val = stats.profile_info(input_name)

        return Response(ret_val, status=status.HTTP_200_OK)

    def create(self, request):
        data = request.data
        username = data["username"]
        email = data["email"]
        password = data["password"]
        team = data["team"].lower()

        if team != "terra" and team != "windy" and team != "ocean":
            return Response("Invalid team selected", status=status.HTTP_409_CONFLICT)
        if User.objects.filter(email=email).exists():
            return Response("User with that email already exists", status=status.HTTP_409_CONFLICT)
        elif User.objects.filter(username=username).exists():
            return Response("User with that username already exists", status=status.HTTP_409_CONFLICT)

        user = User.objects.create_user(username, email, password)

        default_team_colours = {'terra': 'FF8C91', 'windy': '82FF8A', 'ocean': '47C4FF'}
        team, _ = Team.objects.get_or_create(name=team, defaults={'colour': default_team_colours[team]})

        Player.objects.create(user=user, team=team)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=False)
    def change_details(self, request):
        data = request.data
        user = request.user

        player = Player.objects.get(user=user)

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

    @action(methods=['post'], detail=False)
    def change_pass(self, request):
        data = request.data
        user = request.user

        user.set_password(data["new_password"])

        return Response("Password changed", status=status.HTTP_200_OK)

    def workout_history(self, request):
        data = request.GET
        request_user = data["username"]
        ret_val = stats.all_user_workouts(request_user)

        return Response(ret_val, status=status.HTTP_200_OK)

    def specific_workout(self, request):
        data = request.GET
        workout_id = data["id"]
        ret_val = stats.workoutpoints_details(workout_id)

        return Response(ret_val, status=status.HTTP_200_OK)


class GridView(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        data = request.GET
        bl = data['bottom_left']
        tr = data['top_right']
        zoom = data['zoom']
        b, l = bl.split(',')
        bl = [float(b), float(l)]
        t, r = tr.split(',')
        tr = [float(t), float(r)]

        allGrids = grids.sub_sample((bl, tr), zoom)
        return Response(allGrids, status=status.HTTP_200_OK)


class WorkoutSubmission(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        data = request.data
        user = request.user

        waypoints = data["coordinates"]
        start = data["start"][:-1]  # removes 'Z' in timestamp
        end = data["end"][:-1]
        workout_type = data["type"]

        player = Player.objects.get(user=user)

        # convert to seconds - look at what this is
        dur = datetime.datetime.strptime(end, '%Y-%m-%dT%H:%M:%S.%f') - datetime.datetime.strptime(start, '%Y-%m-%dT'
                                                                                                          '%H:%M:%S.%f')

        cals = calc_calories(type, dur)

        workout = Workout.objects.create(player=player, duration=dur.total_seconds(), calories=cals, type=workout_type)

        for entry in waypoints:
            ghost = not entry["isTracking"]
            easting, northing = grids.latlong_to_grid((entry["latitude"], entry["longitude"]))
            timestamp = datetime.datetime.strptime(entry["timestamp"][:-1], '%Y-%m-%dT%H:%M:%S.%f')
            WorkoutPoint.objects.create(workout=workout, time=timestamp, easting=easting, northing=northing,
                                        ghost=ghost)

        bounds = WorkoutPoint.objects.filter(workout=workout).order_by('id')
        for i in range(len(bounds) - 1, 0, -1):
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

            workout.points += len(tiles)
            workout.save()

            if not bounds[i].ghost and not bounds[i-1].ghost:
                checkedTiles = set()

                for tile in tiles:
                    checkedTiles.add((tile.easting, tile.northing))
                    if tile.check_tile_override(bounds[i].time):
                        tile.player = player
                        tile.time = bounds[i].time
                        tile.save()
                        WorkoutSubmission.add_participation(player, (tile.easting, tile.northing))
                for tile in allGrids - checkedTiles:
                    Grid.objects.create(easting=tile[0], northing=tile[1], player=player, time=bounds[i].time)
                    WorkoutSubmission.add_participation(player, tile)

        return Response("Workout added", status=status.HTTP_201_CREATED)

    @staticmethod
    def add_participation(player, tile):
        closest_event = Event.get_closest_active_event(tile)
        if closest_event.check_within(tile):
            event_perf, created = EventPerformance.objects.get_or_create(player=player, event=closest_event,
                                                                         defaults={'contribution': 1})
            if not created:
                event_perf.contribution += 1
                event_perf.save()


class Leaderboard(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @action(methods=['get'], detail=False)
    def points(self, request):
        team_names = request.GET.getlist('teams', [])
        time = datetime.datetime.strptime(request.GET.get('date', ''), "%d/%m/%Y").date()

        ret_val = Player.points(time, team_names)

        return Response(ret_val, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def distance(self, request):
        team_names = request.GET.getlist('teams', [])
        time = datetime.datetime.strptime(request.GET.get('date', ''), "%d/%m/%Y").date()

        ret_val = leaderboards.distance_leaderboard(time, team_names)

        return Response(ret_val, status=status.HTTP_200_OK)


def calc_calories(workout_type, dur):
    return 0
