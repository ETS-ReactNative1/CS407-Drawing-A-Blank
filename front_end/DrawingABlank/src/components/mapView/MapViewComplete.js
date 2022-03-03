import React, {useState, Component, useRef} from 'react';
import Map from './Map.js';
import {Button, StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './style';
import Overlay from '../../containers/Overlay';
import SideBar from '../sidebar/SideBar';
import Drawer from 'react-native-drawer';
import DrawItems from '../sidebar/DrawItems.js';
import {Icon} from 'react-native-elements';

function MapViewComplete() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  // use setOverlayContent to change the content of the overlay
  const [overlayContent, setOverlayContent] = useState();
  const drawRef = useRef();
  const isSideBarOpen = useRef();

  const toggleSidebar = () => {
    isOpen = isSideBarOpen.current;
    if (isOpen) {
      drawRef.current.close();
      isSideBarOpen.current = false;
    } else {
      drawRef.current.open();
      isSideBarOpen.current = true;
    }
  };

  return (
    <View style={styles.mapContainer}>
      <TouchableOpacity onPress={toggleSidebar}>
        <View style={styles.entry}>
          <Icon
            name={'menu'}
            type={'feather'}
            iconStyle={styles.icon}
            containerStyle={styles.menu}
            size={30}
          />
        </View>
      </TouchableOpacity>
      {/* <Button
        title="Burger"
        onPress={() => {
          drawRef.current.open();
        }}
      />
      <Button
        title="Close"
        onPress={() => {
          drawRef.current.close();
        }} */}

      <Drawer
        ref={drawRef}
        type={'overlay'}
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        //styles={drawerStyles}
        tweenHandler={ratio => ({
          main: {opacity: (2 - ratio) / 2},
        })}
        content={<SideBar DrawItems={DrawItems} />}>
        <Map
          setOverlayVisible={setOverlayVisible}
          setOverlayContent={setOverlayContent}
        />
        <Overlay
          visible={overlayVisible}
          setVisible={setOverlayVisible}
          children={overlayContent}
        />
      </Drawer>
    </View>
  );
}

const drawerStyles = {
  drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
};
export default MapViewComplete;
