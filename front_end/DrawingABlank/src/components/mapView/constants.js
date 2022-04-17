export const INIT_ZOOM = {
    latitudeDelta: 0.6039001489487674,
    longitudeDelta: 0.5393288657069206,
}

export const INIT_LOCATION = {
    latitue:0,
    longitide:0
}

export const INIT_REGION = {
    ...INIT_ZOOM,
    ...INIT_LOCATION
}

export const locationConfig = {
    enableHighAccuracy: true,
    timeout: 200, // max time for location request duration
    maximumAge: 1000, // max age before it will refresh cache
    distanceFilter: 5, // min moved distance before next data point
  };