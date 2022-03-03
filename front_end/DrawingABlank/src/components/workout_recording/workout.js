import {submit_workout} from '../../api/api_workout';

const haversine = require('haversine');

export class Workout {
  //In the future, this constructor needs to accept a user id or JWT from secret storage.
  constructor() {
    this.date_start = new Date();
    this.date_end = new Date();
    this.coordinates = [];
    this.recording = false;
  }
  startWorkout() {
    if (!this.recording) {
      this.coordinates = [];
      this.date_start = new Date();
      this.recording = true;
    }
  }
  addCoordinate(latitude, longitude) {
    if (this.recording) {
      var time = new Date();
      this.coordinates.push({
        latitude: latitude,
        longitude: longitude,
        timestamp: time,
      });
    }
  }
  stopWorkout() {
    if (this.recording) {
      this.date_end = new Date();
      console.log(JSON.stringify(this.toJSON()));
      submit_workout(this.toJSON());
      this.recording = false;
    }
  }

  // Debug function for workout_history.js
  setWorkoutEndDate(endDate) {
    this.date_end = endDate;
  }
  // Debug function for workout_history.js
  setWorkoutStartDate(startDate) {
    this.date_start = startDate;
  }
  // Debug function for workout_history.js
  getWorkoutEndDate() {
    return this.date_end;
  }
  // Debug function for workout_history.js
  getWorkoutStartDate() {
    return this.date_start;
  }
  // Debug function for workout_history.js
  addCoordinateDelay(latitude, longitude, delayMins) {
    if (this.recording) {
      var time = new Date();
      var delayTime = new Date(time.getTime() + delayMins * 60000);
      this.coordinates.push({
        latitude: latitude,
        longitude: longitude,
        timestamp: delayTime,
      });
    }
  }

  toJSON() {
    return {
      start: this.date_start,
      end: this.date_end,
      coordinates: this.coordinates,
      type: 'walk',
    };
  }
  /*
        These functions may most likely be handled by the back-end, but I am putting these in the front-end for some demonstration purposes.
    */
  getAverageSpeed() {
    if (this.coordinates.length <= 1) {
      return 0;
    }
    var current_speed = 0.0;
    for (var c = 1; c < this.coordinates.length; c++) {
      var distance = haversine(this.coordinates[c - 1], this.coordinates[c], {
        unit: 'meter',
      });
      current_speed +=
        distance /
        ((this.coordinates[c].timestamp - this.coordinates[c - 1].timestamp) /
          1000) /
        (this.coordinates.length - 1);
    }
    return current_speed;
  }
  getSpeedvsTime() {
    if (this.coordinates.length <= 1) {
      return [];
    }

    var result = [{speed: 0.0, time: 0.0}];
    var seconds = 0.0;
    for (var c = 1; c < this.coordinates.length; c++) {
      var distance = haversine(this.coordinates[c - 1], this.coordinates[c], {
        unit: 'meter',
      });
      var time =
        (this.coordinates[c].timestamp - this.coordinates[c - 1].timestamp) /
        1000;
      var speed = distance / time;
      seconds += time;
      result.push({speed: speed, time: seconds});
    }
    return result;
  }
  getTotalDistance() {
    if (this.coordinates.length <= 1) {
      return 0;
    }
    var current_distance = 0.0;
    for (var c = 1; c < this.coordinates.length; c++) {
      current_distance += haversine(
        this.coordinates[c - 1],
        this.coordinates[c],
        {unit: 'meter'},
      );
    }
    return current_distance;
  }
  getDistanceVsTime() {
    if (this.coordinates.length <= 1) {
      return [];
    }

    var result = [{distance: 0.0, time: 0.0}];
    var seconds = 0.0;
    var current_distance = 0.0;
    for (var c = 1; c < this.coordinates.length; c++) {
      var distance = haversine(this.coordinates[c - 1], this.coordinates[c], {
        unit: 'meter',
      });
      var time =
        (this.coordinates[c].timestamp - this.coordinates[c - 1].timestamp) /
        1000;
      seconds += time;
      current_distance += distance;
      result.push({distance: current_distance, time: seconds});
    }
    return result;
  }
}
