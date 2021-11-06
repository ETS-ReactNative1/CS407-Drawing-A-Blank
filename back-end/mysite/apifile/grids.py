import bng
from pyproj import Transformer

"""

Coordinate systems:
Latitude longitude coordinates will use WGS84("EPSG:4326"): https://en.wikipedia.org/wiki/World_Geodetic_System
British National grid(BNG) will use the 1936 datum OSGB36("EPSG:27700"): https://en.wikipedia.org/wiki/Ordnance_Survey_National_Grid 

Grid reference of BNG as = a String data type of form 2 letters followed by {4,6,8,10} integers.
latlong coordinates should be in a tuple: [0] = latitude, [1] = longitude

Note: conversions back and forth will introduce a slight error: can be by 1 square. 
Should be fine due to GPS error and latlong coordinate rounding. But can apparently fix by making a geoid correction.

#TODO: havent dealt with boundary conditions: e.g. SP 99999 99999 will need to increment the letter when the numbers are incremented. will bug out if you do tho.


#TODO: Need to integrate into django!!!!
"""



#Function input: Grid reference of BNG as a string
#Function output: A tuple containing converted latitude and longitude (both floats).
def gridToLatlong(grid):

    #defines the transformation from UK ordinance survey to lat long
    transformer = Transformer.from_crs("EPSG:27700", "EPSG:4326")

    #converts to numeric only grid references
    x, y = bng.to_osgb36(grid)
    return transformer.transform(x, y)



#Function input: A tuple containing converted latitude and longitude (both floats): Requires a couple of decimal places for accuracy
#Function output: Grid reference of BNG as a string returns 2 letters + 10 digits.
def latlongToGrid(latlong):

    #defines the transformation from lat long to UK ordinance survey
    transformer = Transformer.from_crs("EPSG:4326","EPSG:27700")

    #Converts to grid, specified 10 figs for accuracy.
    x, y = transformer.transform(latlong[0], latlong[1])
    return bng.from_osgb36((x,y),figs=10)



#Function input: Grid reference as String
#Function output: A list of tuples containing converted latitude and longitude coordinates for all 4 corners of the current grid.
def latlongsOfGrid(grid):

    #get the length of eastings/northings and extract components
    figs = int((len(grid)-2)//2)
    letters = grid[0:2]
    eastings = int(grid[2:2+figs])
    northings = int(grid[2+figs:])


    coordinates = []

    #get the 4 points on the square/grid
    #grid references refer to the bottom left corner of the grid so need to get positively adjacent grids coordinates.
    grids = [(0,0),(1,0),(1,1),(0,1)]
    for i in range(len(grids)):
        newEastings = eastings +grids[i][0]
        newNorthings = northings + grids[i][1]

        #concatenating strings to construct new grid
        newGrid = letters + str(newEastings) + str(newNorthings) 
        coordinates.append(gridToLatlong(newGrid))

    return coordinates




#Function input: Current latitude longitude position
#Function output: A list of grids within the radius.
def gridsInRadius(position, radius=5):

    return 0

#Function input: Current and old latitude longitude position
#Function output: A list of grids within the straight line path.
def gridsInPath(positionA, positionB):

    return 0



#Function input: 4 longitude/latitude coordinates that the screen can see
#Function output: 4 corner grids + everything that the screen can see(?)
def gridsVisible(coords):

    return 0

#print(latlongToGrid((52.28595049078488 , -1.5329988849241394)))
print(latlongsOfGrid("SP3195365415"))