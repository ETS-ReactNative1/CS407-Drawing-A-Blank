from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

# example query on data 

# from .serializers import HeroSerializer
# from .models import Hero


# class HeroViewSet(viewsets.ModelViewSet):
#     queryset = Hero.objects.all().order_by('name')
#     serializer_class = HeroSerializer


from .models import Team, Event
import json
from django.http import JsonResponse

def test_colour(self):
    retval = {"colour": Team.get_colour(),}

    return JsonResponse(retval)

def current_events(self):
    ret_val = dict()
    # events = Event.get_current_events()
    events = [1,2,3]

    for event in events:
        # bound = Event.get_bound(event.id)

        bound = 1

        # values = {
        #     'start': event.start,
        #     'end': event.end,
        #     'bound': bound
        # }

        values = {
            "start": 1,
            "end": 2,
            "bound": 3
        }

        # ret_val[event.id] = values

        ret_val[event] = values

    return JsonResponse(ret_val, safe=False)


