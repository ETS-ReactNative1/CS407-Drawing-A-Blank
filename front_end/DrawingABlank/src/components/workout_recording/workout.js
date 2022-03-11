import { submit_workout } from '../../api/api_workout';
import PushNotification,{Importance} from "react-native-push-notification";

const haversine = require('haversine');

export class Workout{
    //In the future, this constructor needs to accept a user id or JWT from secret storage.
    constructor(){
        this.date_start = new Date();
        this.date_end = new Date();
        this.coordinates = [];
        this.recording = false;
        PushNotification.createChannel(
            {
              channelId: "fresgo-workout", // (required)
              channelName: "Fresgo Channel", // (required)
              channelDescription: "Fresgo notification channel", // (optional) default: undefined.
              playSound: false, // (optional) default: true
              soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
              importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
    }
    startNotification(){
        PushNotification.localNotification({
            channelId:'fresgo-workout',
            ongoing: true, // (optional) set whether this is an "ongoing" notification
            priority: "high", // (optional) set notification priority, default: high
            showWhen:true,
            when:this.date_start.getTime(),
            usesChronometer:true,
            invokeApp:true,
            autoCancel:false,
            /* iOS and Android properties */
            id:0,
            title: "Fresgo", // (optional)
            message: `Recording Workout`, // (required)
            picture:'',
            userInfo: {start:this.date_start}, // (optional) default: {} (using null throws a JSON value '<null>' error)
            playSound: false, // (optional) default: true
            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        })
    }
    stopNotification(){
        PushNotification.cancelLocalNotification(0);
    }
    startWorkout(){
        if(!this.recording){
            this.coordinates = [];
            this.date_start = new Date();
            this.recording = true;
            this.startNotification();
        }
    }
    addCoordinate(latitude,longitude){
        if(this.recording){
            var time = new Date();
            this.coordinates.push({"latitude":latitude,"longitude":longitude, "timestamp":time});
        }
    }
    stopWorkout(){
        if(this.recording){
            this.stopNotification();
            this.date_end = new Date();
            console.log(JSON.stringify(this.toJSON()));
            submit_workout(this.toJSON());
            this.recording = false;
        }
    }
    toJSON(){
        return {"start":this.date_start, "end":this.date_end, "coordinates":this.coordinates, "type":"walk"};
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