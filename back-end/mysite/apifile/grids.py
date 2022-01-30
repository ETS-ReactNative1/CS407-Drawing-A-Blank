import math
import bng
import numpy as np
from bresenham import bresenham
from django.db.models import Q
from pyproj import Transformer
from .models import Grid, CoordsConvert

"""
bng is main library used: https://pypi.org/project/bng/

Coordinate systems: Latitude longitude coordinates will use WGS84("EPSG:4326"): 
https://en.wikipedia.org/wiki/World_Geodetic_System British National grid(BNG) will use the 1936 datum OSGB36(
"EPSG:27700"): https://en.wikipedia.org/wiki/Ordnance_Survey_National_Grid 

Grid reference of BNG as = a String data type of form 2 letters followed by {4,6,8,10} integers.
latlong coordinates should be in a tuple: [0] = latitude, [1] = longitude

Note: conversions back and forth will introduce a slight error: can be by 1 square. 
Should be fine due to GPS error and latlong coordinate rounding. But can apparently fix by making a geoid correction.

Dealt with boundary conditions: e.g. SP 99999 99999 when incremented needs to modify the letter: Fixed by first 
converted to all numeric so that the library converts it to the correct letter.(cant just increment letter due to how 
the bng coordinates work) 

"""

UNIT_TILE_SIZE = 5


def distance(point_a, point_b):
    a_east, a_north = point_a
    b_east, b_north = point_b
    return math.sqrt((a_east - b_east) ** 2 + (a_north - b_north) ** 2)


def calculate_speed(point_a, point_b, time_in_between):
    """
    Function input: 2 grid coordinates and the time taken to get from point A to point B
    Function output: the calculated speed in meters per unit time(for example if timeInbetween was in seconds then
    output is X m/s).
    """
    dist = distance(point_a, point_b)
    return dist / time_in_between


def calculate_radius(speed):
    # https://www.desmos.com/calculator/hhnpngcpsr
    return max(1, math.floor(-0.1000 * speed * speed + 1.500 * speed))


def grid_to_latlong(grid):
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


def latlong_to_grid(latlong):
    """
    Function input: A tuple containing converted latitude and longitude (both floats): Requires a couple of decimal
    places for accuracy Function output: Grid reference of BNG as a easting northing tuple.
    """
    # defines the transformation from lat long to UK ordinance survey
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:27700")
    grid = transformer.transform(latlong[0], latlong[1])
    easting = round(grid[0])
    easting = easting - (easting % UNIT_TILE_SIZE)
    northing = round(grid[1])
    northing = northing - (northing % UNIT_TILE_SIZE)
    return easting, northing


def bounds_of_grid(location, size=1):
    """
    Returns the latitude and longitudes of the input grid. 
    The size argument determines how large the grid is e.g. size=2 means the bounds describe a 2x2 grid

    Function input: Grid reference as easting and northing tuple Function output: A list of tuples containing
    converted latitude and longitude coordinates for all 4 corners of the current grid.
    """

    dist = size * UNIT_TILE_SIZE

    easting, northing = location

    # grid references refer to the bottom left corner of the grid so need to get positively adjacent grids coordinates.
    tiles = CoordsConvert.objects.filter(Q(easting=easting, northing=northing) |
                                         Q(easting=easting + dist, northing=northing) |
                                         Q(easting=easting, northing=northing + dist) |
                                         Q(easting=easting + dist, northing=northing + dist)).order_by("easting", "northing")
    if len(tiles) != 4:
        coordinates = []

        # grid references refer to the bottom left corner of the grid so need to get positively adjacent grids
        # coordinates.
        grid_diffs = [(0, 0), (dist, 0), (dist, dist), (0, dist)]
        for diff in grid_diffs:
            new_easting = easting + diff[0]
            new_northing = northing + diff[1]

            # convert to latlong
            latitude, longitude = grid_to_latlong((new_easting, new_northing))
            if not CoordsConvert.objects.filter(easting=new_easting, northing=new_northing).exists():
                CoordsConvert.objects.create(easting=new_easting, northing=new_northing,
                                             longitude=longitude, latitude=latitude)
            coordinates.append({"latitude": latitude, "longitude": longitude})

        return coordinates
    return [{"latitude": tiles[0].latitude, "longitude": tiles[0].longitude},
            {"latitude": tiles[1].latitude, "longitude": tiles[1].longitude},
            {"latitude": tiles[3].latitude, "longitude": tiles[3].longitude},
            {"latitude": tiles[2].latitude, "longitude": tiles[2].longitude}]


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


def grids_in_radius(position, radius=4):
    """
    Function input: Current latitude longitude position
    Function output: A list of grids within the radius.
    """
    x, y = position
    # seems fine for now, could set the function's center at 0,0 and just
    # add the offset to the origin of the square.
    grids = points_in_circle_np(radius, x, y)
    grids = [(x[0] - (x[0] % UNIT_TILE_SIZE), x[1] - (x[1] % UNIT_TILE_SIZE)) for x in grids]

    # grids = list(map(lambda p: bng.from_osgb36(p, figs=10), grids))
    return set(grids)


def grids_in_path(point_a, point_b):
    """
    Function input: Current and old easting and northing tuples
    Function output: A list of grids within the straight line path.

    Library: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    """

    east_a, north_a = point_a
    east_b, north_b = point_b

    # Using the bresenham line algorithm implemented using a library.
    grids = list(bresenham(east_a, north_a, east_b, north_b))
    grids = [(x[0] - (x[0] % UNIT_TILE_SIZE), x[1] - (x[1] % UNIT_TILE_SIZE)) for x in grids]

    # https://stackoverflow.com/questions/10212445/map-list-item-to-function-with-arguments
    # grids = list(map(lambda p: bng.from_osgb36(p, figs=10), grids))

    # convert to set to remove duplicate grids from modulo op
    return set(grids)


def all_grids_with_path(point_a, point_b, radius):
    """
    All grids in the path given the old and current easting and northings including the radius around the path to colour in.
    """
    grids_path = grids_in_path(point_a, point_b)

    # lots of overlapping circles so use set to remove duplicates (seems fine for efficiency for now).
    all_grids = set()
    for grid in grids_path:
        grids_radius = grids_in_radius(grid, radius)
        all_grids.update(grids_radius)

    return all_grids


def sub_sample(coords, sub_dimension=1):
    """
        uses all tiles visible and ensures that not too many grids are sent back to the user.
        zoom_level indicates the size of each grid. zoom_level=1 means 1x1 grids so nothing gets sampled.
        zoom_level=2 means 2x2 grids.

        also considers the colours and finds the average colour for that larger grid.
    """

    if sub_dimension == 1:
        return grids_visible(coords)

    zoom_level = sub_dimension * UNIT_TILE_SIZE

    bottom_left = coords[0]
    top_right = coords[1]

    lower_east, lower_north = latlong_to_grid(bottom_left)
    upper_east, upper_north = latlong_to_grid(top_right)

    tiles = Grid.objects.raw('''SELECT
                                    id,
                                    east,
                                    north,
                                    colour 
                                FROM 
                                    (
                                    SELECT  
                                        apifile_grid.id,
                                        (easting DIV ''' + str(zoom_level) + ''') AS east,
                                        (northing DIV ''' + str(zoom_level) + ''') AS north,
                                        colour,
                                        COUNT(*) as num  
                                    FROM 
                                        apifile_grid JOIN apifile_team ON apifile_grid.team_id = apifile_team.id  
                                    WHERE  
                                        easting >= ''' + str(lower_east) + ''' 
                                        AND easting <= ''' + str(upper_east) + '''
                                        AND northing >= ''' + str(lower_north) + ''' 
                                        AND northing <= ''' + str(upper_north) + '''  
                                    GROUP BY east, north, colour
                                    ORDER BY east, north, num DESC
                                    ) RES
                                GROUP BY east, north ORDER BY east, north;''')

    all_coords = []
    for tile in tiles:
        bounds = bounds_of_grid((tile.east * zoom_level, tile.north * zoom_level), size=sub_dimension)
        if bounds:
            all_coords.append({"colour": tile.colour, "bounds": bounds})
    return all_coords


def grids_visible(coords):
    """
    Function input: 4 longitude/latitude coordinates that the screen can see
    Function output: coordinates of every grid that is visible.
    """
    # if quadrilateral and bottomleft < topRight then only need two coords.
    bottom_left = coords[0]
    top_right = coords[1]

    lower_east, lower_north = latlong_to_grid(bottom_left)
    upper_east, upper_north = latlong_to_grid(top_right)

    all_coords = []

    # this is quite slow: zooming out means theres a lot of grids and repeated coordinates/calculations Could fix by
    # "super sampling" grids e.g. 4 1x1m grids average their colour to make 1 4x4m grid. (only need to access colour)
    # or by saving coordinates to not calculate again. Then you can access less coordinates and do less calculations.
    tiles = Grid.objects.filter(northing__range=(lower_north, upper_north),
                                easting__range=(lower_east, upper_east))

    for tile in tiles:
        all_coords.append({"colour": tile.team.colour, "bounds": bounds_of_grid((tile.easting, tile.northing))})

    return all_coords
