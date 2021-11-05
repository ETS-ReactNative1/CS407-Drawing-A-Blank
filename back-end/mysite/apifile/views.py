from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

# example query on data 

# from .serializers import HeroSerializer
# from .models import Hero


# class HeroViewSet(viewsets.ModelViewSet):
#     queryset = Hero.objects.all().order_by('name')
#     serializer_class = HeroSerializer


from .models import Team
from django.http import JsonResponse

def test_colour(a):
    # use Team.get_colour instead of the blue, only there because empty database
    retval = {"colour": "blue",}

    return JsonResponse(retval)

