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
        this.coordinates.push({"latitude":latitude,"longitude":longitude});
    }
    stopWorkout(){
        this.date_end = new Date();
    }
    toJSON(){
        return {"start":this.date_start, "end":this.date_end, "coordintaes":this.coordinates} 
    }
}