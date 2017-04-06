import React from 'react';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';

const BikeMap = withGoogleMap(props => {
  console.log(props)
  return (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    onClick={props.onMapClick}
  >
    {props.markers.map((marker, index) => (

      <Marker
        {...marker}
      />
    ))}
  </GoogleMap>
)});

export default BikeMap;

