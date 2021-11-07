import bng
from bresenham import bresenham
from pyproj import Transformer

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
def latlongsOfGrid(grid,distance=1):

    #Extract eastings and northings and make numerical only for easy manipulation.
    eastings, northings = bng.to_osgb36(grid)


    coordinates = []


    #grid references refer to the bottom left corner of the grid so need to get positively adjacent grids coordinates.
    grids = [(0,0),(distance,0),(distance,distance),(0,distance)]
    for i in range(len(grids)):
        newEastings = eastings +grids[i][0]
        newNorthings = northings + grids[i][1]

        #convert to 2 letter + 10 digit form to convert to latlong
        newGrid = bng.from_osgb36((newEastings, newNorthings), figs=10)
        coordinates.append(gridToLatlong(newGrid))

    return coordinates




#Function input: Current latitude longitude position
#Function output: A list of grids within the radius.
#https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
def gridsInRadius(position, radius=4):

    return 0

#Function input: Current and old latitude longitude position
#Function output: A list of grids within the straight line path.
#https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
def gridsInPath(positionA, positionB):
    '''
    xA,yA = bng.to_osgb36(positionA)
    xB,yB = bng.to_osgb36(positionB)

    if(xA!=xB):
        gradient = (yB-yA)/(xB-xA)
    else:
        return None

    xIncrement = 0
    if(xA<xB):
        xIncrement = 1
    elif(xA>xB):
        xIncrement = -1

    
    grids = []
    
    currentX = xA
    currentY = yA
    grids.append(bng.from_osgb36((currentX,currentY),figs=10))
    while(currentX!=xB or currentY!=yB):
        currentX += xIncrement
        currentY = int(round(gradient*(currentX-xA)+yA))
        print(currentX,currentY)
        grids.append(bng.from_osgb36((currentX,currentY),figs=10))
    
    '''
    xA,yA = bng.to_osgb36(positionA)
    xB,yB = bng.to_osgb36(positionB)

    #just use the library :)
    grids = list(bresenham(xA,yA,xB,yB))

    #https://stackoverflow.com/questions/10212445/map-list-item-to-function-with-arguments
    grids = list(map(lambda p: bng.from_osgb36(p, figs=10), grids))


    return grids



#Function input: 4 longitude/latitude coordinates that the screen can see
#Function output: coordinates of every grid that is visible.
def gridsVisible(coords):
    
    #if quadrilateral and bottomleft < topRight then only need two coords.
    bottomLeft = coords[0]
    topRight = coords[2]

    blGrid = latlongToGrid(bottomLeft)
    trGrid = latlongToGrid(topRight)

    eastBL, northBL = bng.to_osgb36(blGrid)
    eastTR, northTR = bng.to_osgb36(trGrid)

    allCoords = []

    #this is quite slow: zooming out means theres a lot of grids and repeated coordinates/calculations
    #Could fix by "super sampling" grids e.g. 4 1x1m grids average their colour to make 1 4x4m grid. (only need to access colour)
    #Then you can access less coordinates and do less calculations.
    for i in range(northBL,northTR+1):
        for j in range(eastBL,eastTR+1):
            currentGrid = bng.from_osgb36((j,i), figs=10)
            colour = "red" #get from database?
            allCoords.append({"colour": colour, "coords": latlongsOfGrid(currentGrid)})

    return allCoords

#print(latlongToGrid((52.28595049078488 , -1.5329988849241394)))
#print(gridsInPath("SP3195565415","SP3195565419"))