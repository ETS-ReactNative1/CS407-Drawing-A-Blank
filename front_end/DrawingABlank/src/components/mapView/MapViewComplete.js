import React, {Fragment, useState, Component, useRef, useEffect} from 'react';
import Map from './Map.js';
import {Button, StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './style';
import Overlay from '../../containers/Overlay';
import SideBar from '../sidebar/SideBar';
import Drawer from 'react-native-drawer';
import DrawItems from '../sidebar/DrawItems.js';
import {Icon} from 'react-native-elements';
import useRegion from './useRegion.js';

function MapViewComplete() {
  // Overlay Container Visiblity and Content Hooks
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState();

  // useRegion Hook - Controls user render and view regions via updates from map
  const [region, setRegion, regionFeatures, DrawRenderRegionFeatures] =
    useRegion(setOverlayVisible, setOverlayContent);

  // DOM Refs
  const drawerRef = useRef();

  // Sidebar open-state ref & open-close toggle
  const isSideBarOpen = useRef();
  const toggleSidebar = () => {
    isOpen = isSideBarOpen.current;
    if (isOpen) {
      drawerRef.current.close();
      isSideBarOpen.current = false;
    } else {
      drawerRef.current.open();
      isSideBarOpen.current = true;
    }
  };
  return (
    <View style={styles.mapContainer}>
      {region.latitude == 0 && region.longitude == 0 ? (
        <Text style={styles.centred_text}> Loading Location Information </Text>
      ) : (
        <Fragment>
          {/* <TouchableOpacity onPress={toggleSidebar}>
            <View style={styles.menu}>
              <Icon
                name={'menu'}
                type={'feather'}
                iconStyle={styles.menuIcon}
                containerStyle={styles.menu}
                size={30}
              />
            </View>
          </TouchableOpacity> */}
          <Drawer
            ref={drawerRef}
            type={'overlay'}
            tapToClose={true}
            openDrawerOffset={0.2} // 20% gap on the right side of drawer
            panCloseMask={0.2}
            closedDrawerOffset={-3}
            styles={drawerStyles}
            tweenHandler={ratio => ({
              main: {opacity: (2 - ratio) / 2},
            })}
            content={
              <SideBar
                DrawItems={DrawItems}
                setOverlayVisible={setOverlayVisible}
                setOverlayContent={setOverlayContent}
              />
            }>
            <Map
              setOverlayVisible={setOverlayVisible}
              setOverlayContent={setOverlayContent}
              region={region}
              setRegion={setRegion}
              regionFeatures={regionFeatures}
              DrawRenderRegionFeatures={DrawRenderRegionFeatures}
              toggleSidebar={toggleSidebar}
            />
            <Overlay
              visible={overlayVisible}
              setVisible={setOverlayVisible}
              children={overlayContent}
            />
          </Drawer>
        </Fragment>
      )}
    </View>
  );
}

const drawerStyles = {
  drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
};
export default MapViewComplete;
