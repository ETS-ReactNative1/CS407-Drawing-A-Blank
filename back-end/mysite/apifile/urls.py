from django.urls import include, path
from rest_framework import routers
from . import views
from rest_framework.authtoken import views as views_auth_token

router = routers.DefaultRouter()

router.register("events", views.EventView, "events")
router.register("map", views.GridView, "map")
router.register("user", views.UserProfile, "user")
router.register("workout", views.WorkoutSubmission, "workout")

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    # built in authentication view, returns json {'token': "sss"} when valid username + password posted to it
    path('api-token-auth/', views_auth_token.obtain_auth_token),
]
