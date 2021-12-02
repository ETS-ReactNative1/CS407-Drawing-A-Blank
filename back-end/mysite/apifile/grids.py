import math
import bng
import numpy as np
from bresenham import bresenham
from pyproj import Transformer
from .models import Grid
from PIL import ImageColor

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
    return math.floor(-0.1000 * speed * speed + 1.500 * speed)


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

    return round(grid[0]), round(grid[1])


def bounds_of_grid(location, dist=1):
    """
    Returns the latitude and longitudes of the input grid. 
    The distance argument determines how large the grid is e.g. distance=1 means the grid is 1x1 meters.

    Function input: Grid reference as easting and northing tuple Function output: A list of tuples containing
    converted latitude and longitude coordinates for all 4 corners of the current grid.
    """

    if type(location) == str:
        easting, northing = bng.to_osgb36(location)
    else:
        easting, northing = location

    coordinates = []

    # grid references refer to the bottom left corner of the grid so need to get positively adjacent grids coordinates.
    grids = [(0, 0), (dist, 0), (dist, dist), (0, dist)]
    for i in range(len(grids)):
        new_eastings = easting + grids[i][0]
        new_northings = northing + grids[i][1]

        # convert to 2 letter + 10 digit form to convert to latlong
        new_grid = bng.from_osgb36((new_eastings, new_northings), figs=10)
        coordinates.append(grid_to_latlong(new_grid))

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


def grids_in_radius(position, radius=4):
    """
    Function input: Current latitude longitude position
    Function output: A list of grids within the radius.
    """
    x, y = position
    # seems fine for now, could set the function's center at 0,0 and just
    # add the offset to the origin of the square.
    grids = points_in_circle_np(radius, x, y)

    # grids = list(map(lambda p: bng.from_osgb36(p, figs=10), grids))
    return grids


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

    # https://stackoverflow.com/questions/10212445/map-list-item-to-function-with-arguments
    # grids = list(map(lambda p: bng.from_osgb36(p, figs=10), grids))

    return grids


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


def super_sample(coords, zoom_level=1):
    """
    uses all tiles visible and ensures that not too many grids are sent back to the user.
    zoom_level indicates the size of each grid. zoom_level=1 means 1x1 grids so nothing gets sampled.
    zoom_level=2 means 2x2m grids.
    
    also considers the colours and finds the average colour for that larger grid.
    """

    bottomLeft = coords[0]
    topRight = coords[2]

    lower_east, lower_north = latlong_to_grid(bottomLeft)
    upper_east, upper_north = latlong_to_grid(topRight)

    # get the differences
    east_diff = abs(upper_east - lower_east)
    north_diff = abs(upper_north - lower_north)
    print(east_diff, north_diff)

    # ensure both E and N are both divisible by zoom_level
    padding_E = east_diff % zoom_level
    padding_N = north_diff % zoom_level
    tiles_E = Grid.objects.filter(northing__range=(lower_north, upper_north + padding_N),
                                  easting__range=(lower_east, upper_east + padding_E))

    # create 2d arrays that are smaller dimensions due to larger grids.
    east_size = (east_diff + padding_E) // zoom_level
    north_size = (north_diff + padding_N) // zoom_level
    coords = np.zeros(shape=(east_size, north_size), dtype=object)
    colours = np.zeros(shape=(east_size, north_size), dtype=object)

    # rgb values to get avg.
    for i in range(len(colours)):
        for j in range(len(colours[i])):
            colours[i][j] = (0, 0, 0)

    # group grids into NxN blocks based on zoom level.
    for tile in tiles_E:
        index = ((tile.easting - lower_east), (tile.northing - lower_north))

        # gets the bottom left per NxN grid. and also not the top row as that is divisible by zoom_level due to padding.
        if (index[0] < east_diff and index[1] < north_diff):

            # do element wise addition in 3 tuple (rgb) for avg per grid.
            colours[index[0] // zoom_level][index[1] // zoom_level] = [sum(x) for x in
                                                                       zip(ImageColor.getcolor("#" + tile.team.colour,
                                                                                               "RGB"),
                                                                           colours[index[0] // zoom_level][
                                                                               index[1] // zoom_level])]

            # check if bottom left of large grid.
            if (index[0] % zoom_level == 0 and index[1] % zoom_level == 0):
                # uses zoom level to get larger bounds.
                coords[index[0] // zoom_level][index[1] // zoom_level] = bounds_of_grid(
                    bng.from_osgb36((tile.easting, tile.northing), figs=10), zoom_level)

    coords = coords.flatten()
    colours = colours.flatten()
    allCoords = []
    for i in range(coords.size):
        # blend colour: largest value will always be FF(255) and then everything will be scaled relative to that.
        avg_colour = tuple(ti // (zoom_level * zoom_level) for ti in colours[i])
        avg_colour = tuple(ti / (max(avg_colour)) for ti in avg_colour)
        avg_colour = tuple(int(ti * 255) for ti in avg_colour)

        # https://www.codespeedy.com/convert-rgb-to-hex-color-code-in-python/
        allCoords.append({"colour": '%02x%02x%02x' % avg_colour, "bounds": coords[i]})
    return allCoords


def super_sample_alt(coords, zoom_level=1):
    """
        uses all tiles visible and ensures that not too many grids are sent back to the user.
        zoom_level indicates the size of each grid. zoom_level=1 means 1x1 grids so nothing gets sampled.
        zoom_level=2 means 2x2m grids.

        also considers the colours and finds the average colour for that larger grid.
        """

    bottomLeft = coords[0]
    topRight = coords[2]

    lower_east, lower_north = latlong_to_grid(bottomLeft)
    upper_east, upper_north = latlong_to_grid(topRight)

    # get the differences
    east_diff = abs(upper_east - lower_east)
    north_diff = abs(upper_north - lower_north)
    print(east_diff, north_diff)

    # ensure both E and N are both divisible by zoom_level
    upper_east = upper_east + east_diff % zoom_level
    upper_north = upper_north + north_diff % zoom_level

    tiles = Grid.objects.raw('''SELECT
                                    id,
                                    (O.northing / ''' + str(zoom_level) + ''') as north,
                                    (O.easting / ''' + str(zoom_level) + ''') as east,
                                    (SELECT colour
                                    FROM (apifile_grid JOIN apifile_team ON apifile_grid.team_id = apifile_team.id) I
                                    WHERE (O.northing / ''' + str(zoom_level) + ''') = (I.northing / ''' +
                             str(zoom_level) + ''') AND (O.easting / ''' + str(zoom_level) + ''') = (I.easting / ''' +
                             str(zoom_level) + ''')
                                    GROUP BY colour
                                    ORDER BY COUNT(*) DESC
                                    LIMIT 1) as colour
                                FROM apifile_grid O
                                WHERE easting >= ''' + str(lower_east) + ''' AND easting <= ''' + str(upper_east)
                             + ''' AND northing >= ''' + str(lower_north) + ''' AND northing <= '''
                             + str(upper_north) + '''
                                GROUP BY north, east''')

    all_coords = []
    for tile in tiles:
        all_coords.append({"colour": tile.colour,
                           "bounds": bounds_of_grid((tile.east * zoom_level, tile.north * zoom_level),
                                                    dist=zoom_level)})
    return all_coords


def grids_visible(coords):
    """
    Function input: 4 longitude/latitude coordinates that the screen can see
    Function output: coordinates of every grid that is visible.
    """
    # if quadrilateral and bottomleft < topRight then only need two coords.
    bottomLeft = coords[0]
    topRight = coords[2]

    lower_east, lower_north = latlong_to_grid(bottomLeft)
    upper_east, upper_north = latlong_to_grid(topRight)

    allCoords = []

    # this is quite slow: zooming out means theres a lot of grids and repeated coordinates/calculations Could fix by
    # "super sampling" grids e.g. 4 1x1m grids average their colour to make 1 4x4m grid. (only need to access colour)
    # or by saving coordinates to not calculate again. Then you can access less coordinates and do less calculations.
    tiles = Grid.objects.filter(northing__range=(lower_north, upper_north),
                                easting__range=(lower_east, upper_east))

    for tile in tiles:
        allCoords.append({"colour": tile.team.colour, "bounds": bounds_of_grid((tile.easting, tile.northing))})

    return allCoords


def grids_visible_alt(coords):
    """
    Function input: 4 longitude/latitude coordinates that the screen can see
    Function output: coordinates of every grid that is visible.
    """
    # if quadrilateral and bottomleft < topRight then only need two coords.
    bottomLeft = coords[0]
    topRight = coords[2]

    lower_east, lower_north = latlong_to_grid(bottomLeft)
    upper_east, upper_north = latlong_to_grid(topRight)

    bounds = np.zeros(shape=(upper_east - lower_east + 2, upper_north - lower_north + 2, 2))
    colours = np.zeros(shape=(upper_east - lower_east + 1, upper_north - lower_north + 1), dtype="S6")

    # this is quite slow: zooming out means theres a lot of grids and repeated coordinates/calculations Could fix by
    # "super sampling" grids e.g. 4 1x1m grids average their colour to make 1 4x4m grid. (only need to access colour)
    # or by saving coordinates to not calculate again. Then you can access less coordinates and do less calculations.
    tiles = Grid.objects.filter(northing__range=(lower_north, upper_north),
                                easting__range=(lower_east, upper_east))
    for tile in tiles:
        index = (tile.easting - lower_east, tile.northing - lower_north)
        colours[index[0]][index[1]] = tile.team.colour
        for bound in ((0, 0), (1, 0), (0, 1), (1, 1)):
            if bounds[index[0] + bound[0]][index[1] + bound[1]][0] == 0:
                coords = grid_to_latlong((tile.easting + bound[0], tile.northing + bound[1]))
                bounds[index[0] + bound[0]][index[1] + bound[1]][0] = coords[0]
                bounds[index[0] + bound[0]][index[1] + bound[1]][1] = coords[1]

    return {"colour": colours.tolist(), "bounds": bounds.tolist()}
