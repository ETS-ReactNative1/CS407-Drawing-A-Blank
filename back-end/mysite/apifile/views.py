from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from . import grids
# Create your views here.




# example query on data 

# from .serializers import HeroSerializer
# from .models import Hero


# class HeroViewSet(viewsets.ModelViewSet):
#     queryset = Hero.objects.all().order_by('name')
#     serializer_class = HeroSerializer

class LatlongsOfGrid(viewsets.ViewSet):

    #get 4 coordinates of a grid for testing:
    #http://127.0.0.1:8000/gridsCoords/?grid=SP3003376262 enter a grid reference and you should get 4 coordinates.
    def list(self, request):    

        #need to get actual grid + colour from database.
        grid =request.query_params.get("grid")
        if(grid==None):
            return Response("need a grid reference, try: http://127.0.0.1:8000/gridsCoords/?grid=SP3195365415", 400)
        
        coords = grids.latlongsOfGrid(grid)
        color = "red" #get colour data from database
        jsonString = [
            {
                "colour":color,
                "coords":coords
            }
        ]
        return Response(jsonString)
    

    #post - receiving 4 coordinates => respond with all grids visible.
    #function works but quite slow
    def create(self,request):
        coords = request.data[0]
        print(coords)
        bl = coords['bottom_left']
        br = coords['bottom_right']
        tr = coords['top_right']
        tl = coords['top_left']

        allGrids = grids.gridsVisible([bl,br,tr,tl])
        return Response(allGrids)



