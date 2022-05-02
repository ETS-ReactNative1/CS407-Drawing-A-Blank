import {submit_workout} from '../../api/api_workout';
import PushNotification, {Importance} from 'react-native-push-notification';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const haversine = require('haversine');
const TASK_NAME = 'FRESGO_GET_LOCATION';
const SUBSAMPLE_CONSTANT = 10;

export class Workout {
  //In the future, this constructor needs to accept a user id or JWT from secret storage.
  constructor() {
    this.date_start = new Date();
    this.date_end = new Date();
    this.coordinates = [];
    this.recording = false;
    this.tracking = true;
    this.type = 'walk';
    this.calories = 0;
    PushNotification.createChannel(
      {
        channelId: 'fresgo-workout', // (required)
        channelName: 'Fresgo Channel', // (required)
        channelDescription: 'Fresgo notification channel', // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    //https://stackoverflow.com/questions/60696365/the-best-way-of-tracking-location-in-background-using-react-native-expo-in-202
    TaskManager.defineTask(TASK_NAME, async ({data: {locations}, err}) => {
      if (err) {
        console.log(err);
        return;
      }

      const [location] = locations;
      console.log('GOT LOCATION IN WORKOUT:' + JSON.stringify(location));
      if (this.recording) {
        console.log('ADDING COORDINATE:' + JSON.stringify(location));
        this.addCoordinate(
          location.coords.latitude,
          location.coords.longitude,
          this.tracking,
        ); //True for now until ghost mode is chosen
      }
    });
  }

  startNotification() {
    PushNotification.localNotification({
      channelId: 'fresgo-workout',
      ongoing: true, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: high
      showWhen: true,
      when: this.date_start.getTime(),
      usesChronometer: true,
      invokeApp: true,
      autoCancel: false,
      /* iOS and Android properties */
      id: 0,
      title: 'Fresgo', // (optional)
      message: `Recording Workout`, // (required)
      picture: '',
      userInfo: {start: this.date_start}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    });
  }
  stopNotification() {
    PushNotification.cancelLocalNotification(0);
  }
  startWorkout(type) {
    if (!this.recording) {
      this.coordinates = [];
      this.type = type;
      this.date_start = new Date();
      this.recording = true;
      this.startTracking();
    }
  }
  startTracking() {
    //https://stackoverflow.com/questions/60696365/the-best-way-of-tracking-location-in-background-using-react-native-expo-in-202
    Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 5, // minimum change (in meters) betweens updates
      deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
      foregroundService: {
        notificationTitle: 'Fresgo',
        notificationBody: 'Recording Workout',
      },
    });
  }
  stopTracking() {
    Location.hasStartedLocationUpdatesAsync(TASK_NAME).then(value => {
      if (value) {
        Location.stopLocationUpdatesAsync(TASK_NAME);
      }
    });
  }
  setWorkoutEndDate(endDate) {
    this.date_end = endDate;
  }

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
  setCalories(calories) {
    this.calories = calories;
  }
  getCalories() {
    return this.calories;
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

  addCoordinateAtTime(latitude, longitude, timestamp) {
    if (this.recording) {
      this.coordinates.push({
        latitude: latitude,
        longitude: longitude,
        timestamp: timestamp,
      });
    }
  }
  addCoordinate(latitude, longitude, isTracking) {
    if (this.recording) {
      var time = new Date();
      this.coordinates.push({
        latitude: latitude,
        longitude: longitude,
        timestamp: time,
        isTracking: isTracking,
      });
    }
  }

  stopWorkout() {
    if (this.recording) {
      //this.stopNotification();
      this.date_end = new Date();
      console.log('COMPLETED WORKOUT:' + JSON.stringify(this.toJSON()));
      //submit_workout(this.toJSON());
      this.recording = false;
      this.stopTracking();
    }
  }
  changeTracking(newTracking) {
    console.log('UPDATING TRACKING');
    this.tracking = newTracking;
  }
  toJSON() {
    return {
      start: this.date_start,
      end: this.date_end,
      coordinates: this.coordinates,
      type: this.type,
    };
  }
  removeDuplicateCoordinates(){
    var timestamps = [];
    var result = [];
    for(var i = 0; i < this.coordinates.length; i++){
      if(!timestamps.includes(this.coordinates[i].timestamp)){
        result.push(this.coordinates[i]);
        timestamps.push(this.coordinates[i].timestamp);
      }
    }
    return result;
  }
  uploadWorkout() {
    this.coordinates = this.removeDuplicateCoordinates();
    console.log("FINAL COORDINATES:"+JSON.stringify(this.coordinates));
    return submit_workout(this.toJSON());
  }

  /*
        These functions may most likely be handled by the back-end, but I am putting these in the front-end for some demonstration purposes.
    */

  isAnomaly(speed) {
    return this.type == 'cycle' ? speed >= 100 : speed >= 11;
  }

  getAverageSpeed() {
    if (this.coordinates.length <= 1) return 0;
    var current_speed = 0.0;
    var total_points = 0;
    for (var c = 1; c < this.coordinates.length; c++) {
      var distance = haversine(this.coordinates[c - 1], this.coordinates[c], {
        unit: 'meter',
      });
      if(this.coordinates[c].timestamp - this.coordinates[c-1].timestamp != 0){
        var speed =
          distance /
          ((this.coordinates[c].timestamp - this.coordinates[c - 1].timestamp) /
            1000);
        if(!this.isAnomaly(speed)){
          current_speed += speed;
          total_points += 1;
        }
      }
    }
    return current_speed / total_points;
  }
  getSpeedvsTime() {
    if (this.coordinates.length <= 1) return [];

    var result = [];
    var seconds = 0.0;

    //Subsample factor: floor(coordinate amount/10)
    var subsample_factor = Math.ceil(
      this.coordinates.length / SUBSAMPLE_CONSTANT,
    );
    console.log('SUBSAMPLE FACTOR IS ' + subsample_factor);
    console.log('COORDINATE SIZE IS ' + this.coordinates.length);
    for (var c = subsample_factor; c < this.coordinates.length; c+=subsample_factor) {
      var distance = haversine(this.coordinates[c - 1], this.coordinates[c], {
        unit: 'meter',
      });
      var time =
        (this.coordinates[c].timestamp - this.coordinates[c - 1].timestamp) /
        1000;
      if(time==0) continue;
      var speed = distance / time;
      console.log("SPEED OBTAINED:"+speed);
      //Anomaly (noone can cycle or run at this speed)
      if (this.isAnomaly(speed)) continue;
      time = (this.coordinates[c].timestamp - this.coordinates[c - subsample_factor].timestamp) /
        1000;
      seconds += time;
      result.push({speed: speed, time: seconds});
    }
    console.log('RETURNING SPEED V TIME GRAPH:'+JSON.stringify(result));
    return result;
  }
  getTotalDistance() {
    if (this.coordinates.length <= 1) return 0;
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
    if (this.coordinates.length <= 1) return [];
    var result = [{distance: 0.0, time: 0.0}];
    var seconds = 0.0;
    var current_distance = 0.0;

    //Subsample factor: floor(coordinate amount/10)
    var subsample_factor = Math.ceil(
      this.coordinates.length / SUBSAMPLE_CONSTANT,
    );

    for (var c = 1; c < this.coordinates.length; c+=subsample_factor) {
      var distance = haversine(this.coordinates[c - 1], this.coordinates[c], {
        unit: 'meter',
      });
      var time =
        (this.coordinates[c].timestamp - this.coordinates[c - 1].timestamp) /
        1000;
      if(time == 0) continue;
      if (this.isAnomaly(distance / time)) continue;

      seconds += time;
      current_distance += distance;
      result.push({distance: current_distance, time: seconds});
      console.log('ADDED AT INDEX ' + c);
    }
    console.log('RETURNING DISTANCE V TIME GRAPH:'+JSON.stringify(result));
    return result;
  }
}
