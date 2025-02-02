import datetime

import pytz
from django.test import TestCase
from rest_framework.authtoken.admin import User

from . import leaderboards, stats
from . import models
from .models import Event, EventBounds, Player, Team, Workout, WorkoutPoint, Grid, EventStandings, EventPerformance


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
        self.workout1 = Workout.objects.create(player=self.player, duration=120, calories=0, type="run")
        eastings = [100, 150, 300]
        northings = [100, 150, 300]
        minutes = [0, 1, 2]

        for i in range(len(minutes)):
            time = datetime.datetime(2022, 1, 1, hour=1, minute=minutes[i], second=0, tzinfo=pytz.UTC)
            WorkoutPoint.objects.create(workout=self.workout1, time=time, easting=eastings[i], northing=northings[i],
                                        ghost=False)

        self.workout1.calories = stats.calories_total(self.player.weight, self.workout1)
        self.workout1.save(update_fields=['calories'])
        # Workout 2 - Player 2, Team red, 1/1/2020

        eastings = [0, 100, 0]
        northings = [50, 100, 0]
        minutes = [0, 1, 2]

        self.workout2 = Workout.objects.create(player=self.player2, duration=120, calories=0)
        for i in range(len(minutes)):
            time = datetime.datetime(2022, 1, 1, hour=1, minute=minutes[i], second=0, tzinfo=pytz.UTC)
            WorkoutPoint.objects.create(workout=self.workout2, time=time, easting=eastings[i], northing=northings[i],
                                        ghost=False)

        self.workout2.calories = stats.calories_total(self.player2.weight, self.workout2)
        self.workout2.save(update_fields=['calories'])

        # Workout 3 - Player 2, Team red, 1/1/2022.
        eastings = [0, 100, 0]
        northings = [0, 0, 0]
        minutes = [0, 1, 2]

        self.workout3 = Workout.objects.create(player=self.player2, duration=120, calories=0)
        for i in range(len(minutes)):
            time = datetime.datetime(2022, 1, 1, hour=1, minute=minutes[i], second=0, tzinfo=pytz.UTC)
            WorkoutPoint.objects.create(workout=self.workout3, time=time, easting=eastings[i], northing=northings[i],
                                        ghost=False)

        self.workout3.calories = stats.calories_total(self.player2.weight, self.workout3)

        # Workout 4 - Player 3, Team Blue, 1/1/2022.
        eastings = [50, 100, 50]
        northings = [1000, 1000, 1000]
        minutes = [0, 1, 2]

        self.workout4 = Workout.objects.create(player=self.player3, duration=120, calories=0)
        for i in range(len(minutes)):
            time = datetime.datetime(2022, 1, 1, hour=1, minute=minutes[i], second=0, tzinfo=pytz.UTC)
            WorkoutPoint.objects.create(workout=self.workout4, time=time, easting=eastings[i], northing=northings[i],
                                        ghost=False)

        # Workout 5 - Player 4, Team Green, 1/1/2022.
        eastings = [0, 200, 50]
        northings = [1000, 1000, 1000]
        minutes = [0, 1, 2]

        self.workout5 = Workout.objects.create(player=self.player4, duration=120, calories=0)
        for i in range(len(minutes)):
            time = datetime.datetime(2022, 1, 1, hour=1, minute=minutes[i], second=0, tzinfo=pytz.UTC)
            WorkoutPoint.objects.create(workout=self.workout5, time=time, easting=eastings[i], northing=northings[i],
                                        ghost=False)

        # Workout 6 - Player 1, Team red, 1/1/2000
        eastings = [0, 0, 150]
        northings = [0, 150, 0]
        minutes = [0, 1, 2]

        self.workout6 = Workout.objects.create(player=self.player, duration=120, calories=0)
        for i in range(len(minutes)):
            time = datetime.datetime(2022, 1, 1, hour=1, minute=minutes[i], second=0, tzinfo=pytz.UTC)
            WorkoutPoint.objects.create(workout=self.workout6, time=time, easting=eastings[i], northing=northings[i],
                                        ghost=False)

    def test_players(self):
        time = datetime.datetime(2021, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)

        print("Calories")
        print(self.workout1.calories)
        print(" ")

        print("2021")
        print(leaderboards.distance_leaderboard(time, []))
        print(leaderboards.distance_leaderboard(time, ["Green", "Blue"]))
        print(" ")

        time = datetime.datetime(2019, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        print("2019")
        print(leaderboards.distance_leaderboard(time, []))
        print(leaderboards.distance_leaderboard(time, ["Red"]))
        print(" ")
        print(stats.profile_info("testuser"))
        print(" ")
        print("workout history:")
        print(stats.all_user_workouts(self.user))
        print(stats.all_user_workouts(self.user2))
        print(" ")
        print(stats.workoutpoints_details(1, self.player))

    def test_points(self):
        time = datetime.datetime(2021, 1, 1, hour=1, minute=0, second=0, tzinfo=pytz.UTC)
        print("2021")
        print(Player.points(time, []))
        print(Player.points(time, ["Green", "Blue"]))


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
        self.p_windy_2 = Player.objects.create(user=u4, team=windy)

        # Create date to test around
        self.test_date = datetime.date.today()
        test_time = datetime.datetime.now()

        # Add event that is already closed
        self.old_event = Event.objects.create(start=self.test_date - datetime.timedelta(days=30),
                                              end=self.test_date - datetime.timedelta(days=5))
        EventBounds.objects.create(event=self.old_event, easting=10, northing=10)
        EventBounds.objects.create(event=self.old_event, easting=10, northing=30)
        EventBounds.objects.create(event=self.old_event, easting=30, northing=30)
        EventBounds.objects.create(event=self.old_event, easting=30, northing=10)
        Grid.objects.create(easting=15, northing=10, player=self.p_terra, time=test_time)
        Grid.objects.create(easting=10, northing=15, player=self.p_terra, time=test_time)
        Grid.objects.create(easting=15, northing=25, player=self.p_terra, time=test_time)
        Grid.objects.create(easting=25, northing=20, player=self.p_ocean, time=test_time)
        EventPerformance.objects.create(player=self.p_terra, event=self.old_event, contribution=3)
        EventPerformance.objects.create(player=self.p_ocean, event=self.old_event, contribution=1)

        # Add event that needs to be closed
        self.close_event = Event.objects.create(start=self.test_date - datetime.timedelta(days=50),
                                                end=self.test_date - datetime.timedelta(days=1),
                                                active=True)
        EventBounds.objects.create(event=self.close_event, easting=50, northing=50)
        EventBounds.objects.create(event=self.close_event, easting=50, northing=70)
        EventBounds.objects.create(event=self.close_event, easting=70, northing=70)
        EventBounds.objects.create(event=self.close_event, easting=70, northing=50)
        Grid.objects.create(easting=50, northing=55, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=55, northing=60, player=self.p_ocean, time=test_time)
        Grid.objects.create(easting=50, northing=50, player=self.p_windy_2, time=test_time)
        Grid.objects.create(easting=60, northing=65, player=self.p_terra, time=test_time)
        Grid.objects.create(easting=65, northing=55, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=65, northing=50, player=self.p_terra, time=test_time)
        EventPerformance.objects.create(player=self.p_terra, event=self.close_event, contribution=2)
        EventPerformance.objects.create(player=self.p_windy, event=self.close_event, contribution=2)
        EventPerformance.objects.create(player=self.p_ocean, event=self.close_event, contribution=1)
        EventPerformance.objects.create(player=self.p_windy_2, event=self.close_event, contribution=1)

        # Add event that needs to be opened
        self.open_event = Event.objects.create(start=self.test_date - datetime.timedelta(days=1),
                                               end=self.test_date + datetime.timedelta(days=25))
        EventBounds.objects.create(event=self.open_event, easting=50, northing=10)
        EventBounds.objects.create(event=self.open_event, easting=50, northing=30)
        EventBounds.objects.create(event=self.open_event, easting=70, northing=30)
        EventBounds.objects.create(event=self.open_event, easting=70, northing=10)
        Grid.objects.create(easting=55, northing=10, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=55, northing=15, player=self.p_ocean, time=test_time)
        Grid.objects.create(easting=50, northing=25, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=60, northing=20, player=self.p_terra, time=test_time)
        Grid.objects.create(easting=60, northing=15, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=65, northing=10, player=self.p_terra, time=test_time)

        # Add event that should not be opened yet
        self.future_event = Event.objects.create(start=self.test_date + datetime.timedelta(days=1),
                                                 end=self.test_date + datetime.timedelta(days=25))
        EventBounds.objects.create(event=self.future_event, easting=10, northing=50)
        EventBounds.objects.create(event=self.future_event, easting=10, northing=70)
        EventBounds.objects.create(event=self.future_event, easting=30, northing=70)
        EventBounds.objects.create(event=self.future_event, easting=30, northing=50)
        Grid.objects.create(easting=10, northing=55, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=25, northing=60, player=self.p_ocean, time=test_time)
        Grid.objects.create(easting=20, northing=55, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=15, northing=55, player=self.p_terra, time=test_time)
        Grid.objects.create(easting=10, northing=65, player=self.p_windy, time=test_time)
        Grid.objects.create(easting=15, northing=50, player=self.p_terra, time=test_time)

    def test_open(self):
        Event.open_events(self.test_date)

        # Retrieve updated event tile counts
        old_grids_after = Grid.objects.filter(easting__range=(10, 30), northing__range=(10, 30)).count()
        close_grids_after = Grid.objects.filter(easting__range=(50, 70), northing__range=(50, 70)).count()
        open_grids_after = Grid.objects.filter(easting__range=(50, 70), northing__range=(10, 30)).count()
        future_grids_after = Grid.objects.filter(easting__range=(10, 30), northing__range=(50, 70)).count()

        # Check counts match
        self.assertEqual(4, old_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(6, close_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(6, future_grids_after, "Event grids changed that should not have been.")

        # Check the event to open was wiped
        self.assertNotEqual(6, open_grids_after, "Event grids not changed.")
        self.assertEqual(open_grids_after, 0, "Event grids not cleared.")

    def test_close(self):
        Event.close_events(self.test_date)

        # Retrieve updated event tile counts
        old_grids_after = Grid.objects.filter(easting__range=(10, 30), northing__range=(10, 30)).count()
        close_grids_after = Grid.objects.filter(easting__range=(50, 70), northing__range=(50, 70)).count()
        open_grids_after = Grid.objects.filter(easting__range=(50, 70), northing__range=(10, 30)).count()
        future_grids_after = Grid.objects.filter(easting__range=(10, 30), northing__range=(50, 70)).count()

        # Check counts match
        self.assertEqual(4, old_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(6, open_grids_after, "Event grids changed that should not have been.")
        self.assertEqual(6, future_grids_after, "Event grids changed that should not have been.")

        # Check the event to close was wiped
        self.assertNotEqual(6, close_grids_after, "Event grids not changed.")
        self.assertEqual(close_grids_after, 0, "Event grids not cleared.")

        # Get team positions for closed event
        positions = EventStandings.objects.filter(event=self.close_event).order_by("-score")
        first_place = positions[0]
        second_place = positions[1]
        third_place = positions[2]

        # Check winners calculated correctly
        self.assertEqual("windy", first_place.team.name, "Team Windy was not first")
        self.assertEqual("terra", second_place.team.name, "Team Terra was not second")
        self.assertEqual("ocean", third_place.team.name, "Team Océan was not third")

        # Check coins distributed correctly
        p_terra = Player.objects.get(user__username="u1")
        self.assertEqual(4, p_terra.coins, "Terra player did not get correct rewards")
        p_windy = Player.objects.get(user__username="u2")
        self.assertEqual(6, p_windy.coins, "Windy player 1 did not get correct rewards")
        p_ocean = Player.objects.get(user__username="u3")
        self.assertEqual(1, p_ocean.coins, "Ocean player did not get correct rewards")
        p_windy_2 = Player.objects.get(user__username="u4")
        self.assertEqual(3, p_windy_2.coins, "Windy player 2 did not get correct rewards")


class EventDetailsTests(TestCase):

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
        self.p_windy_2 = Player.objects.create(user=u4, team=windy)

        # Create date to test around
        self.test_date = datetime.date.today()

        # Add event that is already closed
        self.old1_end = self.test_date - datetime.timedelta(days=5)
        self.old_event1 = Event.objects.create(start=self.test_date - datetime.timedelta(days=30),
                                               end=self.old1_end)
        EventBounds.objects.create(event=self.old_event1, easting=10, northing=10)
        EventBounds.objects.create(event=self.old_event1, easting=10, northing=30)
        EventBounds.objects.create(event=self.old_event1, easting=30, northing=30)
        EventBounds.objects.create(event=self.old_event1, easting=30, northing=10)
        EventPerformance.objects.create(player=self.p_terra, event=self.old_event1, contribution=3)
        EventPerformance.objects.create(player=self.p_ocean, event=self.old_event1, contribution=1)
        EventStandings.objects.create(event=self.old_event1, team=terra, score=3)
        EventStandings.objects.create(event=self.old_event1, team=ocean, score=1)
        EventStandings.objects.create(event=self.old_event1, team=windy, score=0)

        # Add event that needs to be closed
        self.old2_end = self.test_date - datetime.timedelta(days=1)
        self.old_event2 = Event.objects.create(start=self.test_date - datetime.timedelta(days=50),
                                               end=self.old2_end)
        EventBounds.objects.create(event=self.old_event2, easting=50, northing=50)
        EventBounds.objects.create(event=self.old_event2, easting=50, northing=70)
        EventBounds.objects.create(event=self.old_event2, easting=70, northing=70)
        EventBounds.objects.create(event=self.old_event2, easting=70, northing=50)
        EventPerformance.objects.create(player=self.p_terra, event=self.old_event2, contribution=2)
        EventPerformance.objects.create(player=self.p_windy, event=self.old_event2, contribution=2)
        EventPerformance.objects.create(player=self.p_ocean, event=self.old_event2, contribution=1)
        EventPerformance.objects.create(player=self.p_windy_2, event=self.old_event2, contribution=1)
        EventStandings.objects.create(event=self.old_event2, team=terra, score=2)
        EventStandings.objects.create(event=self.old_event2, team=ocean, score=1)
        EventStandings.objects.create(event=self.old_event2, team=windy, score=3)

        # Add open event
        self.open_event = Event.objects.create(start=self.test_date - datetime.timedelta(days=1),
                                               end=self.test_date + datetime.timedelta(days=25),
                                               active=True)
        EventBounds.objects.create(event=self.open_event, easting=50, northing=10)
        EventBounds.objects.create(event=self.open_event, easting=50, northing=30)
        EventBounds.objects.create(event=self.open_event, easting=70, northing=30)
        EventBounds.objects.create(event=self.open_event, easting=70, northing=10)

    def test_only_player_results(self):
        test_return = Event.event_scores(self.test_date - datetime.timedelta(days=10), self.p_windy)

        self.assertEqual(1, len(test_return))

    def test_return_values(self):
        test_return = Event.event_scores(self.test_date - datetime.timedelta(days=10), self.p_terra)

        self.assertEqual(2, len(test_return))

        # test first return
        event = test_return[0]
        self.assertEqual(event['id'], self.old_event2.id)
        self.assertEqual(2, event['performance']['user'])
        self.assertEqual(2, event['performance']['terra'])
        self.assertEqual(3, event['performance']['windy'])
        self.assertEqual(1, event['performance']['ocean'])

        # test second return
        event = test_return[1]
        self.assertEqual(event['id'], self.old_event1.id)
        self.assertEqual(3, event['performance']['user'])
        self.assertEqual(3, event['performance']['terra'])
        self.assertEqual(0, event['performance']['windy'])
        self.assertEqual(1, event['performance']['ocean'])
