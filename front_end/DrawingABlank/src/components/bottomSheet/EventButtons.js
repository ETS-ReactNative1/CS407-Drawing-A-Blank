import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {} from 'react-native-gesture-handler';

const EventButtons = ({eventDetails}) => {
  return (
    <View style={styles.buttonBar}>
      {/* Possible Images as buttons... */}
      {/* <TouchableOpacity        
        style={styles.button}>
        <View>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://media.istockphoto.com/vectors/green-tick-checkmark-vector-icon-for-checkbox-marker-symbol-vector-id1079725292?k=20&m=1079725292&s=170667a&w=0&h=UbTk-AjdTSqaNBbEXLDy8T6aFQOkNMUs33mdJ4qTqV4=',
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity        
        style={styles.button}>
        <View>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://miro.medium.com/max/512/1*Js0Y20MwjcTnVAe7KjDXNg.png',
            }}
          />
        </View>
      </TouchableOpacity> */}
      <View>
        <Button
          onPress={eventDetails}
          style={styles.button}
          title="Details"></Button>
      </View>
    </View>
  );
};

export default EventButtons;

const styles = StyleSheet.create({
  buttonBar: {flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'},
  button: {
    backgroundColor: 'blue',
    padding: 5,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
