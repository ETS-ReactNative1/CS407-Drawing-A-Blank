import datetime
from django.test import TestCase
from rest_framework.authtoken.admin import User
import pytz
from . import models
from .models import Event, EventBounds, Player, Team, Workout, WorkoutPoint
from . import leaderboards


class LeaderboardTests(TestCase):
    def setUp(self):
        Team.objects.create(name="Red", colour="FF0000")
        self.team_red = models.Team.objects.get(name="Red")

        Team.objects.create(name="Blue", colour="0000FF")
        self.team_blue = models.Team.objects.get(name="Blue")

        Team.objects.create(name="Green", colour="00FF00")
        self.team_green = models.Team.objects.get(name="Green")

        self.user = User.objects.create_user(username='testuser', password='12345')
        self.player = Player.objects.create(user=self.user, team=self.team_red)

        self.user2 = User.objects.create_user(username='testuser2', password='12345')
        self.player2 = Player.objects.create(user=self.user2, team=self.team_red)


        self.user3 = User.objects.create_user(username='blue_team_user', password='12345')
        self.player3 = Player.objects.create(user=self.user3, team=self.team_blue)

        self.user4 = User.objects.create_user(username='green_team_user', password='12345')
        self.player4 = Player.objects.create(user=self.user4, team=self.team_green)


        #Workout 1 - Player 1, Team red, 1/1/2022
        self.workout1 = Workout.objects.create(player=self.player, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout1, time=time, easting=100, northing=100)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout1, time=time, easting=150, northing=150)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout1, time=time, easting=300, northing=300)


        #Workout 2 - Player 2, Team red, 1/1/2020
        self.workout2 = Workout.objects.create(player=self.player2, duration=120, calories=0)
        time = datetime.datetime(2020, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout2, time=time, easting=0, northing=50)

        time = datetime.datetime(2020, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout2, time=time, easting=100, northing=100)

        time = datetime.datetime(2020, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout2, time=time, easting=0, northing=0)


        #Workout 3 - Player 2, Team red, 1/1/2022.
        self.workout3 = Workout.objects.create(player=self.player2, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=0, northing=0)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=100, northing=0)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=0, northing=0)


        #Workout 4 - Player 3, Team Blue, 1/1/2022.
        self.workout3 = Workout.objects.create(player=self.player3, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=50, northing=1000)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=100, northing=1000)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=50, northing=1000)

        #Workout 5 - Player 4, Team Green, 1/1/2022.
        self.workout3 = Workout.objects.create(player=self.player4, duration=120, calories=0)
        time = datetime.datetime(2022, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=0, northing=1000)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=1, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=200, northing=1000)

        time = datetime.datetime(2022, 1, 1, hour=1, minute=2, second=0, tzinfo=pytz.UTC)
        WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=50, northing=1000)


    def test_players(self):
        time = datetime.datetime(2021, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC )
        print("2021")
        print(leaderboards.distance_leaderboard(time,[]))
        print(leaderboards.distance_leaderboard(time,["Green","Blue"]))

        time = datetime.datetime(2019, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        print("2019")
        print(leaderboards.distance_leaderboard(time,[]))
        print(leaderboards.distance_leaderboard(time,["Red"]))


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
