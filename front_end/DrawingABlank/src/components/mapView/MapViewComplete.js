import React, {useState, Component, useEffect} from 'react';
import Map from './Map.js';
import {StyleSheet, View} from 'react-native';

import {styles} from './style';
import Overlay from '../../containers/Overlay';

function MapViewComplete(props){    
  const [overlayVisible, setOverlayVisible] = useState(false);
  // use setOverlayContent to change the content of the overlay
  const [overlayContent, setOverlayContent] = useState();
  useEffect(()=>{
    console.log("LOCATION:"+JSON.stringify(props.props.location))
  })

  return(
    <View style={styles.mapContainer}>
        <Map
        setOverlayVisible={setOverlayVisible}
        setOverlayContent={setOverlayContent}
        eventsRetrieved={props.props.events_result}
        mapRetrieved={props.props.map_result}
        initialLocation={props.props.location}
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