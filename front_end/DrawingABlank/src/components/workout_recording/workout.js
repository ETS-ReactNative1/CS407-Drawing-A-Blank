const haversine = require('haversine');

export class Workout{
    constructor(){
        this.date_start = new Date();
        this.date_end = new Date();
        this.coordinates = [];
    }
    startWorkout(){
        this.coordinates = [];
        this.date_start = new Date();
    }
    addCoordinate(latitude,longitude){
        var time = new Date();
        this.coordinates.push({"latitude":latitude,"longitude":longitude, "timestamp":time});
    }
    stopWorkout(){
        this.date_end = new Date();
    }
    toJSON(){
        return {"start":this.date_start, "end":this.date_end, "coordinates":this.coordinates};
    }
    /*
        These functions may most likely be handled by the back-end, but I am putting these in the front-end for some demonstration purposes.
    */
    getAverageSpeed(){
        if(this.coordinates.length <= 1)
            return 0;
        var current_speed = 0.0;
        for(var c = 1; c < this.coordinates.length; c++){
            var distance = haversine(this.coordinates[c-1],this.coordinates[c], {unit:'meter'});
            current_speed += (distance/((this.coordinates[c].timestamp-this.coordinates[c-1].timestamp)/1000))/(this.coordinates.length-1);
        }
        return current_speed;
    }
    getSpeedvsTime(){
        if(this.coordinates.length <= 1)
            return [];
        
        var result = [{"speed":0.0,"time":0.0}];
        var seconds = 0.0;
        for(var c = 1; c < this.coordinates.length; c++){
            var distance = haversine(this.coordinates[c-1],this.coordinates[c], {unit:'meter'});
            var time = (this.coordinates[c].timestamp - this.coordinates[c-1].timestamp) / 1000;
            var speed = distance / time;
            seconds += time;
            result.push({"speed":speed,"time":seconds});
        }
        return result;
    }
    getTotalDistance(){
        if(this.coordinates.length <= 1)
            return 0;
        var current_distance = 0.0;
        for(var c = 1; c < this.coordinates.length; c++){
            current_distance += haversine(this.coordinates[c-1],this.coordinates[c], {unit:'meter'});
        }
        return current_distance;
    }
    getDistanceVsTime(){
        if(this.coordinates.length <= 1)
            return [];
        
        var result = [{"distance":0.0,"time":0.0}];
        var seconds = 0.0;
        var current_distance = 0.0;
        for(var c = 1; c < this.coordinates.length; c++){
            var distance = haversine(this.coordinates[c-1],this.coordinates[c], {unit:'meter'});
            var time = (this.coordinates[c].timestamp - this.coordinates[c-1].timestamp) / 1000;
            seconds += time;
            current_distance += distance;
            result.push({"distance":current_distance,"time":seconds});
        }
        return result;
    }
}