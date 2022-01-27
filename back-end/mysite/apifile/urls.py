# apifile/urls.py

from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register("gridsCoords", views.LatlongsOfGrid, "gridsCoords")
router.register("playerLocation", views.PlayerLocation, "playerLocation")
# example
# router.register(r'heroes', views.HeroViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('current-events/', views.current_events),
    path('add-events/', views.add_events),
    path('record-workout/', views.record_workout),
    path('create-user/', views.create_user),
    path('grid-window/', views.grid_window),
    # path('populate-convert/', views.populate_convert),
]
