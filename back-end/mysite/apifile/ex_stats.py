
"""
Kcal ~= METS * bodyMassKg * timePerformingHours

METS = metabolic equivalents
https://sites.google.com/site/compendiumofphysicalactivities/Activity-Categories
https://golf.procon.org/met-values-for-800-activities/

"""

def calories_burned_run(bodymass, avg_speed, time_secs):

    #https://www.desmos.com/calculator/sruqcotkrt using mets data to determine mets ~=~ X * m/s 
    mets = avg_speed*3.452
    return mets*bodymass*(time_secs/3600)

def calories_burned_cycle(bodymass, avg_speed, time_secs):
   #https://www.desmos.com/calculator/qtmbovtlg5
    mets = avg_speed*1.459
    return mets*bodymass*(time_secs/3600)