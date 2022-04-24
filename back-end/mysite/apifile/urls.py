from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register("events", views.Events, "events")
router.register("map", views.GridView, "map")
router.register("user", views.UserProfile, "user")
router.register("workout", views.WorkoutSubmission, "workout")
router.register("leaderboard", views.Leaderboard, "leaderboard")
router.register("token", views.VerifyToken, "token")


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('auth/', views.obtain_exp_auth_token),
]
