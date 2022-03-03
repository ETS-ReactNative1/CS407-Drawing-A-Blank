import datetime
import operator
from functools import reduce

from django.db.models import Q
from django.test import TestCase
from rest_framework.authtoken.admin import User
import pytz
from . import models
from .models import Event, EventBounds, Player, Team, Workout, WorkoutPoint, Grid, EventStandings
from . import leaderboards, stats


class LeaderboardTests(TestCase):
    def setUp(self):
        Team.objects.create(name="Red", colour="FF0000")
        self.team_red = models.Team.objects.get(name="Red")

        Team.objects.create(name="Blue", colour="0000FF")
        self.team_blue = models.Team.objects.get(name="Blue")

        Team.objects.create(name="Green", colour="00FF00")
        self.team_green = models.Team.objects.get(name="Green")

        self.user = User.objects.create_user(username='testuser', password='12345')
        self.player = Player.objects.create(user=self.user, team=self.team_red, gender="Male", height=180, weight=75)

        self.user2 = User.objects.create_user(username='testuser2', password='12345')
        self.player2 = Player.objects.create(user=self.user2, team=self.team_red)

        self.user3 = User.objects.create_user(username='blue_team_user', password='12345')
        self.player3 = Player.objects.create(user=self.user3, team=self.team_blue)

        self.user4 = User.objects.create_user(username='green_team_user', password='12345')
        self.player4 = Player.objects.create(user=self.user4, team=self.team_green)

        # Workout 1 - Player 1, Team red, 1/1/2022
        self.workout1 = Workout.objects.create(player=self.player, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout1, time=time, easting=100, northing=100, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout1, time=time, easting=150, northing=150, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout1, time=time, easting=300, northing=300, ghost=False)

        # Workout 2 - Player 2, Team red, 1/1/2020
        self.workout2 = Workout.objects.create(player=self.player2, duration=120, calories=0)
        time = datetime.datetime(2020, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout2, time=time, easting=0, northing=50, ghost=False)

        time = datetime.datetime(2020, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout2, time=time, easting=100, northing=100, ghost=False)

        time = datetime.datetime(2020, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout2, time=time, easting=0, northing=0, ghost=False)

        # Workout 3 - Player 2, Team red, 1/1/2022.
        self.workout3 = Workout.objects.create(player=self.player2, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=0, northing=0, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=100, northing=0, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=0, northing=0, ghost=False)

        # Workout 4 - Player 3, Team Blue, 1/1/2022.
        self.workout4 = Workout.objects.create(player=self.player3, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout4, time=time, easting=50, northing=1000, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout4, time=time, easting=100, northing=1000, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout4, time=time, easting=50, northing=1000, ghost=False)

        # Workout 5 - Player 4, Team Green, 1/1/2022.
        self.workout5 = Workout.objects.create(player=self.player4, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout5, time=time, easting=0, northing=1000, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout5, time=time, easting=200, northing=1000, ghost=False)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout5, time=time, easting=50, northing=1000, ghost=False)

        # Workout 6 - Player 1, Team red, 1/1/2000
        self.workout6 = Workout.objects.create(player=self.player, duration=120, calories=0)
        time = datetime.datetime(2000, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout6, time=time, easting=0, northing=0, ghost=False)

        time = datetime.datetime(2000, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout6, time=time, easting=0, northing=150, ghost=False)

        time = datetime.datetime(2000, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout6, time=time, easting=150, northing=0, ghost=False)

    def test_players(self):
        time = datetime.datetime(2021, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        print("2021")
        print(leaderboards.distance_leaderboard(time, []))
        print(leaderboards.distance_leaderboard(time, ["Green", "Blue"]))

        time = datetime.datetime(2019, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        print("2019")
        print(leaderboards.distance_leaderboard(time, []))
        print(leaderboards.distance_leaderboard(time, ["Red"]))
        print(stats.profile_info("testuser"))

        print("workout history:")
        print(stats.all_user_workouts(self.user))
        print(stats.all_user_workouts(self.user2))

        print(stats.workoutpoints_details(1))


class EventBoundTests(TestCase):
    def setUp(self):
        # somewhat larger event to test performance
        self.ev1 = Event.objects.create(start=datetime.datetime.now(tz=pytz.UTC),
                                        end=datetime.datetime.now(tz=pytz.UTC) + datetime.timedelta(days=50))
        EventBounds.objects.create(event=self.ev1, easting=400, northing=400)
        EventBounds.objects.create(event=self.ev1, easting=800, northing=400)
        EventBounds.objects.create(event=self.ev1, easting=800, northing=800)
        EventBounds.objects.create(event=self.ev1, easting=400, northing=800)

        # https://www.desmos.com/calculator/g2yl7eeczh
        # small area to test insideness with concave shapes.
        self.ev2 = Event.objects.create(start=datetime.datetime.now(tz=pytz.UTC),
                                        end=datetime.datetime.now(tz=pytz.UTC) + datetime.timedelta(days=50))
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=1000)
        EventBounds.objects.create(event=self.ev2, easting=2000, northing=1000)
        EventBounds.objects.create(event=self.ev2, easting=2000, northing=2000)
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=2000)
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=1750)
        EventBounds.objects.create(event=self.ev2, easting=1250, northing=1750)
        EventBounds.objects.create(event=self.ev2, easting=1250, northing=1250)
        EventBounds.objects.create(event=self.ev2, easting=1000, northing=1250)

        # small event to test counts
        self.ev3 = Event.objects.create(start=datetime.datetime.now(tz=pytz.UTC),
                                        end=datetime.datetime.now(tz=pytz.UTC) + datetime.timedelta(days=50))
        test_points = [(100, 100), (100, 125), (75, 125), (75, 150), (100, 150), (100, 175), (25, 175), (25, 150),
                       (50, 150), (50, 125), (25, 125), (25, 100)]
        for i in test_points:
            EventBounds.objects.create(event=self.ev3, easting=i[0], northing=i[1])

        # events list to test if the function returns the correct event
        self.events_list = [self.ev1, self.ev2, self.ev3]

        # Teams for counts.
        models.Team.objects.create(name="Test Team1", colour="FF0000")
        models.Team.objects.create(name="Test Team2", colour="00FF00")
        team = models.Team.objects.get(name="Test Team1")
        team2 = models.Team.objects.get(name="Test Team2")
        u1 = User.objects.create_user("tu1", "tu1@test.com", "tu1")
        u2 = User.objects.create_user("tu2", "tu2@test.com", "tu2")
        p1 = Player.objects.create(user=u1, team=team)
        p2 = Player.objects.create(user=u2, team=team2)

        models.Grid.objects.create(easting="75", northing="115", player=p1, time=datetime.datetime.now(tz=pytz.UTC))
        models.Grid.objects.create(easting="60", northing="150", player=p2, time=datetime.datetime.now(tz=pytz.UTC))
        models.Grid.objects.create(easting="35", northing="160", player=p1, time=datetime.datetime.now(tz=pytz.UTC))
        # outside event
        models.Grid.objects.create(easting="250", northing="250", player=p1, time=datetime.datetime.now(tz=pytz.UTC))

    def test_bounds(self):
        for event in self.events_list:
            self.assertEqual(event.check_within((110, 150)), False)
            self.assertEqual(event.check_within((150, 600)), False)
            if event == self.ev3:
                self.assertEqual(event.check_within((60, 120)), True)
            else:
                self.assertEqual(event.check_within((60, 120)), False)
            if event == self.ev2:
                self.assertEqual(event.check_within((1500, 1500)), True)
            else:
                self.assertEqual(event.check_within((1500, 1500)), False)

        test = self.events_list[2].all_grids()
        print(test)
        test2 = self.events_list[2].winner()
        print(test2)
        # a = models.Grid.objects.filter( reduce(operator.or_, (Q(easting=i, northing=j) for i,j in test)))

    def test_get_events_in_distance(self):
        self.assertEqual(len(Event.get_events_within_distance((1000, 1000), 200)), 2)
        self.assertEqual(len(Event.get_events_within_distance((300, 300), 300)), 2)
        self.assertEqual(len(Event.get_events_within_distance((500, 500), 1)), 1)


class EventOpenCloseTests(TestCase):

    def setUp(self):
        # Create 3 test teams
        terra = Team.objects.create(name="terra", colour="FF0000")
        windy = Team.objects.create(name="windy", colour="00FF00")
        ocean = Team.objects.create(name="ocean", colour="0000FF")

        # Create 3 test users, one for each team
        u1 = User.objects.create_user(username="u1", password="u1")
        self.p_terra = Player.objects.create(user=u1, team=terra)
        u2 = User.objects.create_user(username="u2", password="u2")
        self.p_windy = Player.objects.create(user=u2, team=windy)
        u3 = User.objects.create_user(username="u3", password="u3")
        self.p_ocean = Player.objects.create(user=u3, team=ocean)
        u4 = User.objects.create_user(username="u4", password="u4")
        self.p_windy_2 = Player.objects.create(user=u4, team=ocean)

        # Create date to test around
        self.test_date = datetime.date.today()

        # Add event that is already closed
        self.old_event = Event.objects.create(start=self.test_date - datetime.timedelta(days=30),
                                              end=self.test_date - datetime.timedelta(days=5))
        EventBounds.objects.create(event=self.old_event, easting=1000, northing=1000)
        EventBounds.objects.create(event=self.old_event, easting=1000, northing=2000)
        EventBounds.objects.create(event=self.old_event, easting=2000, northing=2000)
        EventBounds.objects.create(event=self.old_event, easting=2000, northing=1000)
        Grid.objects.create(easting=1453, northing=1245, player=self.p_terra)
        Grid.objects.create(easting=1451, northing=1125, player=self.p_terra)
        Grid.objects.create(easting=1254, northing=1245, player=self.p_terra)
        Grid.objects.create(easting=1968, northing=1235, player=self.p_ocean)

        # Add event that needs to be closed
        self.close_event = Event.objects.create(start=self.test_date - datetime.timedelta(days=50),
                                                end=self.test_date - datetime.timedelta(days=1),
                                                active=True)
        EventBounds.objects.create(event=self.close_event, easting=5000, northing=5000)
        EventBounds.objects.create(event=self.close_event, easting=5000, northing=6000)
        EventBounds.objects.create(event=self.close_event, easting=6000, northing=6000)
        EventBounds.objects.create(event=self.close_event, easting=6000, northing=5000)
        Grid.objects.create(easting=5453, northing=5245, player=self.p_windy)
        Grid.objects.create(easting=5451, northing=5125, player=self.p_ocean)
        Grid.objects.create(easting=5254, northing=5245, player=self.p_windy_2)
        Grid.objects.create(easting=5968, northing=5235, player=self.p_terra)
        Grid.objects.create(easting=5854, northing=5275, player=self.p_windy)
        Grid.objects.create(easting=5648, northing=5285, player=self.p_terra)

        # Add event that needs to be opened
        self.open_event = Event.objects.create(start=self.test_date - datetime.timedelta(days=1),
                                               end=self.test_date + datetime.timedelta(days=25))
        EventBounds.objects.create(event=self.open_event, easting=5000, northing=1000)
        EventBounds.objects.create(event=self.open_event, easting=5000, northing=2000)
        EventBounds.objects.create(event=self.open_event, easting=6000, northing=2000)
        EventBounds.objects.create(event=self.open_event, easting=6000, northing=1000)
        Grid.objects.create(easting=5453, northing=1245, player=self.p_windy)
        Grid.objects.create(easting=5451, northing=1125, player=self.p_ocean)
        Grid.objects.create(easting=5254, northing=1245, player=self.p_windy)
        Grid.objects.create(easting=5968, northing=1235, player=self.p_terra)
        Grid.objects.create(easting=5854, northing=1275, player=self.p_windy)
        Grid.objects.create(easting=5648, northing=1285, player=self.p_terra)

        # Add event that should not be opened yet
        self.future_event = Event.objects.create(start=self.test_date + datetime.timedelta(days=1),
                                                 end=self.test_date + datetime.timedelta(days=25))
        EventBounds.objects.create(event=self.future_event, easting=5000, northing=10000)
        EventBounds.objects.create(event=self.future_event, easting=5000, northing=20000)
        EventBounds.objects.create(event=self.future_event, easting=6000, northing=20000)
        EventBounds.objects.create(event=self.future_event, easting=6000, northing=10000)
        Grid.objects.create(easting=5453, northing=10245, player=self.p_windy)
        Grid.objects.create(easting=5451, northing=11025, player=self.p_ocean)
        Grid.objects.create(easting=5254, northing=12405, player=self.p_windy)
        Grid.objects.create(easting=5968, northing=12350, player=self.p_terra)
        Grid.objects.create(easting=5854, northing=12075, player=self.p_windy)
        Grid.objects.create(easting=5648, northing=12805, player=self.p_terra)

        # Store grid counts for each event before tests
        self.old_grids_before = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.old_event.all_grids()))).count()
        self.close_grids_before = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.close_event.all_grids()))).count()
        self.open_grids_before = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.open_event.all_grids()))).count()
        self.future_grids_before = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.future_event.all_grids()))).count()

    def test_open(self):
        Event.open_events(self.test_date)

        # Retrieve updated event tile counts
        old_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.old_event.all_grids()))).count()
        close_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.close_event.all_grids()))).count()
        open_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.open_event.all_grids()))).count()
        future_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.future_event.all_grids()))).count()

        # Check counts match
        self.assertEqual(self.old_grids_before, old_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(self.close_grids_before, close_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(self.future_grids_before, future_grids_after, "Event grids changed that should not have been.")

        # Check the event to open was wiped
        self.assertNotEqual(self.open_grids_before, open_grids_after, "Event grids not changed.")
        self.assertEqual(open_grids_after, 0, "Event grids not cleared.")

    def test_close(self):
        Event.close_events(self.test_date)

        # Retrieve updated event tile counts
        old_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.old_event.all_grids()))).count()
        close_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.close_event.all_grids()))).count()
        open_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.open_event.all_grids()))).count()
        future_grids_after = Grid.objects.filter(
            reduce(operator.or_, (Q(easting=i, northing=j) for i, j in self.future_event.all_grids()))).count()

        # Check counts match
        self.assertEqual(self.old_grids_before, old_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(self.open_grids_before, open_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(self.future_grids_before, future_grids_after, "Event grids changed that should not have been.")

        # Check the event to close was wiped
        self.assertNotEqual(self.close_grids_before, close_grids_after, "Event grids not changed.")
        self.assertEqual(close_grids_after, 0, "Event grids not cleared.")

        # Get team positions for closed event
        positions = EventStandings.objects.filter(event=self.close_event).order_by("place")
        first_place = positions[0]
        second_place = positions[1]
        third_place = positions[2]

        # Check winners calculated correctly
        self.assertEqual("windy", first_place.team.name, "Team Windy was not first")
        self.assertEqual("terra", second_place.team.name, "Team Terra was not second")
        self.assertEqual("ocean", third_place.team.name, "Team Océan was not third")

        # Check coins distributed correctly
        self.assertEqual(6, self.p_windy.coins, "Windy player 1 did not get correct rewards")
        self.assertEqual(3, self.p_windy_2.coins, "Windy player 2 did not get correct rewards")
        self.assertEqual(4, self.p_terra.coins, "Terra player did not get correct rewards")
        self.assertEqual(1, self.p_ocean.coins, "Ocean player did not get correct rewards")

