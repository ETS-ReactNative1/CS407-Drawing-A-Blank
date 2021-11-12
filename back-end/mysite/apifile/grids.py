import bng
import numpy as np
from bresenham import bresenham
from pyproj import Transformer
from geopy import distance
from .models import Grid

"""
bng is main library used: https://pypi.org/project/bng/

Coordinate systems:
Latitude longitude coordinates will use WGS84("EPSG:4326"): https://en.wikipedia.org/wiki/World_Geodetic_System
British National grid(BNG) will use the 1936 datum OSGB36("EPSG:27700"): https://en.wikipedia.org/wiki/Ordnance_Survey_National_Grid 

Grid reference of BNG as = a String data type of form 2 letters followed by {4,6,8,10} integers.
latlong coordinates should be in a tuple: [0] = latitude, [1] = longitude

Note: conversions back and forth will introduce a slight error: can be by 1 square. 
Should be fine due to GPS error and latlong coordinate rounding. But can apparently fix by making a geoid correction.

Dealt with boundary conditions: e.g. SP 99999 99999 when incremented needs to modify the letter: 
Fixed by first converted to all numeric so that the library converts it to the correct letter.(cant just increment letter due to how the bng coordinates work)

"""


def latLongDistance(pointA, pointB):
    """
    Function input: 2 tuples each containing latitude and longitude
    Function output: the calculated distance between the two points in meters(float).

    https://geopy.readthedocs.io/en/stable/#module-geopy.distance

    a = (52.285951 , -1.5329989)    SP 31953 65415
    b = (52.285945 , -1.5315330)    SP 32053 65415
    Produces a result of ~100m which aligns with the bng distances.   
    """
    return distance.geodesic(pointA, pointB, ellipsoid='WGS-84').meters


def calculateSpeed(pointA, pointB, timeInbetween):
    """
    Function input: 2 tuples each containing latitude and longitude and the time taken to get from point A to point B
    Function output: the calculated speed in meters per unit time(for example if timeInbetween was in seconds then output is X m/s).
    """
    distance = latLongDistance(pointA, pointB)
    return distance / timeInbetween


def gridToLatlong(grid):
    """
    Converts a BNG grid number to the latitude and longitude of the bottom left corner of the input grid.

    Function input: Grid reference of BNG as a string
    Function output: A tuple containing converted latitude and longitude (both floats).
    """

    # defines the transformation from UK ordinance survey to lat long
    transformer = Transformer.from_crs("EPSG:27700", "EPSG:4326")

    # converts to numeric only grid references
    if type(grid) == str:
        x, y = bng.to_osgb36(grid)
    else:
        x, y = grid
    return transformer.transform(x, y)


def latlongToGrid(latlong):
    """

    Function input: A tuple containing converted latitude and longitude (both floats): Requires a couple of decimal places for accuracy
    Function output: Grid reference of BNG as a string returns 2 letters + 10 digits.
    """
    # defines the transformation from lat long to UK ordinance survey
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:27700")

    # Converts to grid, specified 10 figs for accuracy.
    x, y = transformer.transform(latlong[0], latlong[1])
    return bng.from_osgb36((x, y), figs=10)


def bounds_of_grid(location, distance=1):
    """
    Returns the latitude and longitudes of the input grid. 
    The distance argument determines how large the grid is e.g. distance=1 means the grid is 1x1 meters.

    Function input: Grid reference as easting and northing tuple
    Function output: A list of tuples containing converted latitude and longitude coordinates for all 4 corners of the current grid.
    """

    if type(location) == str:
        easting, northing = bng.to_osgb36(location)
    else:
        easting, northing = location

    coordinates = []

    # grid references refer to the bottom left corner of the grid so need to get positively adjacent grids coordinates.
    grids = [(0, 0), (distance, 0), (distance, distance), (0, distance)]
    for i in range(len(grids)):
        new_eastings = easting + grids[i][0]
        new_northings = northing + grids[i][1]

        # convert to 2 letter + 10 digit form to convert to latlong
        new_grid = bng.from_osgb36((new_eastings, new_northings), figs=10)
        coordinates.append(gridToLatlong(new_grid))

    return coordinates


def points_in_circle_np(radius, x0=0, y0=0):
    """
    https://stackoverflow.com/questions/49551440/python-all-points-on-circle-given-radius-and-center
    """
    x_ = np.arange(x0 - radius - 1, x0 + radius + 1, dtype=int)
    y_ = np.arange(y0 - radius - 1, y0 + radius + 1, dtype=int)
    x, y = np.where((x_[:, np.newaxis] - x0) ** 2 + (y_ - y0) ** 2 <= radius ** 2)
    # x, y = np.where((np.hypot((x_-x0)[:,np.newaxis], y_-y0)<= radius)) # alternative implementation
    for x, y in zip(x_[x], y_[y]):
        yield x, y


def gridsInRadius(position, radius=4):
    """
    Function input: Current latitude longitude position
    Function output: A list of grids within the radius.
    """
    x, y = position
    grids = points_in_circle_np(radius, x, y)  # seems fine for now, could set the function's center at 0,0 and just
    # add the offset to the origin of the square.
    grids = list(map(lambda p: bng.from_osgb36(p, figs=10), grids))
    return grids


def gridsInPath(point_a, point_b):
    """
    Function input: Current and old easting and northing tuples
    Function output: A list of grids within the straight line path.

    Library: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    """

    east_a, north_a = point_a
    east_b, north_b = point_b

    # Using the bresenham line algorithm implemented using a library.
    grids = list(bresenham(east_a, north_a, east_b, north_b))

    # https://stackoverflow.com/questions/10212445/map-list-item-to-function-with-arguments
    grids = list(map(lambda p: bng.from_osgb36(p, figs=10), grids))

    return grids


def grids_visible(coords):
    """
    Function input: 4 longitude/latitude coordinates that the screen can see
    Function output: coordinates of every grid that is visible.
    """
    # if quadrilateral and bottomleft < topRight then only need two coords.
    bottomLeft = coords[0]
    topRight = coords[2]

    blGrid = latlongToGrid(bottomLeft)
    trGrid = latlongToGrid(topRight)

    lower_east, lower_north = bng.to_osgb36(blGrid)
    upper_east, upper_north = bng.to_osgb36(trGrid)

    allCoords = []

    # this is quite slow: zooming out means theres a lot of grids and repeated coordinates/calculations Could fix by
    # "super sampling" grids e.g. 4 1x1m grids average their colour to make 1 4x4m grid. (only need to access colour)
    # or by saving coordinates to not calculate again. Then you can access less coordinates and do less calculations.
    tiles = Grid.objects.filter(northing__lte=upper_north, northing__gte=lower_north,
                                easting__lte=upper_east, easting__gte=upper_east)
    for tile in tiles:
        allCoords.append({"colour": tile.colour, "bounds": bounds_of_grid((tile.easting, tile.northing))})

    return allCoords


def grids_visible_alt(coords):
    """
    Function input: 4 longitude/latitude coordinates that the screen can see
    Function output: coordinates of every grid that is visible.
    """
    # if quadrilateral and bottomleft < topRight then only need two coords.
    bottomLeft = coords[0]
    topRight = coords[2]

    blGrid = latlongToGrid(bottomLeft)
    trGrid = latlongToGrid(topRight)

    lower_east, lower_north = bng.to_osgb36(blGrid)
    upper_east, upper_north = bng.to_osgb36(trGrid)

    bounds = np.zeros(shape=(upper_east-lower_east+1, upper_north-lower_north+1, 2))
    colours = np.empty(shape=(upper_east-lower_east, upper_north-lower_north), dtype=np.str)

    # this is quite slow: zooming out means theres a lot of grids and repeated coordinates/calculations Could fix by
    # "super sampling" grids e.g. 4 1x1m grids average their colour to make 1 4x4m grid. (only need to access colour)
    # or by saving coordinates to not calculate again. Then you can access less coordinates and do less calculations.
    tiles = Grid.objects.filter(northing__lte=upper_north, northing__gt=lower_north,
                                easting__lte=upper_east, easting__gt=upper_east)
    for tile in tiles:
        index = (tile.easting - lower_east, tile.northing - lower_north)
        colours[index[0]][index[1]] = tile.colour
        for bound in ((0, 0), (1, 0), (0, 1), (1, 1)):
            if bounds[index[0] + bound[0]][index[1] + bound[1]][0] == 0:
                coords = gridToLatlong((tile.easting + bound[0], tile.northing + bound[1]))
                bounds[index[0] + bound[0]][index[1] + bound[1]][0] = coords[0]
                bounds[index[0] + bound[0]][index[1] + bound[1]][1] = coords[1]

    return {"colour": colours.tolist(), "bounds:": bounds.tolist()}
