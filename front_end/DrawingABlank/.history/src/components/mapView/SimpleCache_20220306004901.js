import {Value} from 'react-native-reanimated';
import TouchHistoryMath from 'react-native/Libraries/Interaction/TouchHistoryMath';

export default function SimpleCache(initContent = {}) {
  this.content = initContent;

  this.addEntry = ([
    key,
    content,
    refreshContent,
    //requestObject,
    //requesterObject,
    time_to_expire = 10000, // default always get latest from backend
  ]) => {
    if (!content) {
      content = refreshContent();
    }

    expiry_date = Date.now() + time_to_expire;

    key = JSON.stringify(key);

    this.content[key] = [
      content, // promise
      refreshContent,
      expiry_date,
    ];
  };

  // return just the "content" field of an element
  this.getEntryContent = (key, getLatestFlag) => {
    e = this.getEntry(key, getLatestFlag)[0];
    return e;
  };

  this.clear = () => {
    this.content = {};
  };

  this.setEntry = (key, cb) => {
    // cache fov is out of date
    // this.
  };

  this.getEntry = (key, getLatestFlag, filter) => {
    // dont need key to filter

    // if key == funtion, use as filter
    // else as key

    if (filter) {
      entries = Object.entries(this.content);
      entry;
      for (let i = 0; i < values.length; i++) {
        [key, value] = entries[i];
        JSON.parse(key);
        filteredFound = filter(key, value); //expects return entry when filter condition is true

        if (filteredFound) {
          entry = filteredFound;
          break;
        }
      }
    }

    key = JSON.stringify(key);
    entry = this.content[key];

    if (!entry) return [false];

    let [content, refreshContent, expiry_date] = entry;

    if (expiry_date >= Date.now() || getLatestFlag) {
      expiry_date += 10000; //10sec placeholder
      updatedElement = [refreshContent(), refreshContent, expiry_date];
      this.content[key] = updatedElement;
      return updatedElement;
    } else {
      return this.content[key];
    }
  };
}

// need to make n dimensional
// take order to infer depth into hashmap - hashmap of hashmaps
