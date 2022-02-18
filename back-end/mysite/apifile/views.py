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
from . import leaderboards,stats,grids
from .models import Event, Workout, WorkoutPoint, Grid, Player, Team, EventBounds, EventPerformance
from django.db.models import Count


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

    @action(methods=['post'], detail=False)
    def local(self, request):
        data = request.data
        centre = grids.latlong_to_grid(data['point'])
        dist = data['distance']

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

    @action(methods=['get'], detail=False)
    def get_profile(self, request):
        data = request.data
        input_name = data["username"]
        ret_val = stats.profile_info(input_name)
        
        return Response(ret_val, status=status.HTTP_200_OK)

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request):
        data = request.data
        username = data["username"]
        email = data["email"]
        password = data["password"]
        team = data["team"]

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




class GridView(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @action(methods=['post'], detail=False)
    def collect(self, request):
        data = request.data
        bl = data['bottom_left']
        tr = data['top_right']
        zoom = data['zoom']

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
            latlong = (entry["latitude"], entry["longitude"])
            easting, northing = grids.latlong_to_grid(latlong)
            timestamp = datetime.datetime.strptime(entry["timestamp"][:-1], '%Y-%m-%dT%H:%M:%S.%f')
            WorkoutPoint.objects.create(workout=workout, time=timestamp, easting=easting, northing=northing)

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

            workout.points = len(tiles)
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

    @action(methods=['post'], detail=False)
    def points(self, request):
        data = request.data
        team_names = data["teams"]
        time = datetime.datetime.strptime(data["date"], "%d/%m/%Y").date()

        results = Player.points(time, team_names)
        ret_val = dict()

        for res in results:
            team = Team.objects.filter(id=res["team"])
            for t in team:
                vals = {
                    "team": t.name,
                    "points": res["points"]
                }
            ret_val[res["user__username"]] = vals

        return Response(ret_val, status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def distance(self, request):
        data = request.data
        time = datetime.datetime.strptime(data["date"], "%d/%m/%Y").date()
        team_names = data["teams"]
        ret_val = leaderboards.distance_leaderboard(time,team_names)
        return Response(ret_val, status=status.HTTP_200_OK)

    @action(methods=['put'], detail=False)
    def test_data(self, _):
        workouts = Workout.objects.all()
        all_points = Workout.objects.values('id').annotate(sum_points=Count('workoutpoint')).order_by('-points')

        for w in workouts:
            # not correct, using number of gps points sent instead of grids (dummy data)
            points = Workout.objects.filter(id=w.id).annotate(sum_points=Count('workoutpoint'))
            for p in points:
                w.points = p.sum_points
                w.save()
                break
        return Response("test data added", status=status.HTTP_200_OK)

def calc_calories(workout_type, dur):
    return 0
