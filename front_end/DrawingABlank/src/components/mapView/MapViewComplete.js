import React, {useState, Component} from 'react';
import Map from './Map.js';
import {StyleSheet, View} from 'react-native';

import {styles} from './style';
import Overlay from '../../containers/Overlay';

function MapViewComplete(){    
  const [overlayVisible, setOverlayVisible] = useState(false);
  // use setOverlayContent to change the content of the overlay
  const [overlayContent, setOverlayContent] = useState();

  return(
    <View style={styles.mapContainer}>
        <Map
        setOverlayVisible={setOverlayVisible}
        setOverlayContent={setOverlayContent}
        />
        <Overlay
        visible={overlayVisible}
        setVisible={setOverlayVisible}
        children={overlayContent}
        />
    </View>
  )
}
export default MapViewComplete;