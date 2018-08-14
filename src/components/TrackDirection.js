/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  PermissionsAndroid,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import RNGooglePlaces from "react-native-google-places";
import { Card, Text, Icon, Button } from "@shoutem/ui";
import FusedLocation from "react-native-fused-location";

import Loading from "./common/Loading";
import * as actions from "../actions";
import trackDirection from "../reducers/track_direction_reducer";

type Props = {};

let startTracking = false;
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

class TrackDirection extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      des: {
        name: "Pick Location"
      },
      loading: true,
      lat: null,
      lng: null
    };
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      this.getLocationAndroid();
    } else {
      this.getLocationIOS();
    }
  }

  getLocationAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "App needs to access your location",
          message:
            "App needs access to your location " +
            "so we can let our app be even more awesome."
        }
      );
      if (granted) {
        console.log("getting fused location");
        FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED);
        // Get location once.
        const location = await FusedLocation.getFusedLocation(false);
        this.setState({ lat: location.latitude, lng: location.longitude });

        // Set options.
        FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED);
        FusedLocation.setLocationInterval(20000);
        FusedLocation.setFastestLocationInterval(15000);
        FusedLocation.setSmallestDisplacement(10);

        // Keep getting updated location.
        FusedLocation.startLocationUpdates();
        // Place listeners.
        this.subscription = FusedLocation.on("fusedLocation", location => {
          this.setState({ lat: location.latitude, lng: location.longitude });

          if (startTracking) {
            this.props.getRoute(
              { lat: this.state.lat, lng: this.state.lng },
              {
                lat: this.state.des.latitude,
                lng: this.state.des.longitude
              }
            );
          }
          console.log(location);
        });
        this.setState({ loading: false });
        console.log("Got fused location");
      }
    } catch (e) {
      console.error(e);
      console.log("Starting backup locaiton");
      // this.getLocationIOS();
    }
  };

  getLocationIOS = () => {
    try {
      navigator.geolocation.watchPosition(
        position => {
          const {
            coords: { latitude, longitude }
          } = position;
          // for changing the location( custom pickup or drop off point )
          this.setState({
            lat: latitude,
            lng: longitude,
            latitudeDelta: 0.3,
            longitudeDelta: 0.4
          });
          // users current location
          this.setState({ loading: false });
          console.log("got navigator location");
          if (startTracking) {
            this.props.getRoute(
              { lat: latitude, lng: longitude },
              { lat: this.state.des.latitude, lng: this.state.des.longitude }
            );
          }
        },
        error => {
          console.warn(error);
          // this.setState({ region: {
          //         latitude: IUST_COORDS_OBJECT.latitude,
          //         longitude: IUST_COORDS_OBJECT.longitude,
          //         latitudeDelta: LATITUDE_DELTA + 1,
          //         longitudeDelta: LONGITUDE_DELTA + 1
          //     } });
          // this.setState({ loading: false });
          console.log("got no location ");
        },

        { enableHighAccuracy: false, timeout: 2000 }
      );
    } catch (e) {
      console.error(e);
    }
  };

  openSearchModal = () => {
    const { lat, lng } = this.state;
    RNGooglePlaces.openAutocompleteModal({
      latitude: lat,
      longitude: lng
    })
      .then(place => {
        startTracking = true;
        this.setState({ des: place });

        this.props.getRoute(
          { lat, lng },
          { lat: place.latitude, lng: place.longitude }
        );

        this.map.fitToCoordinates(
          [
            {
              latitude: lat,
              longitude: lng
            },
            { latitude: place.latitude, longitude: place.longitude }
          ],
          {
            edgePadding: DEFAULT_PADDING,
            animated: true
          }
        );
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  };
  render() {
    const { lat, lng } = this.state;
    const { coords } = this.props;
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => {
            this.map = ref;
          }}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.004
          }}
          provider="google"
          style={styles.map}
          showsUserLocation
        >
          {coords != null &&
            coords.length > 1 && (
              <MapView.Polyline
                coordinates={coords}
                strokeWidth={2}
                strokeColor="black"
              />
            )}
          {coords != null &&
            coords.length > 1 && (
              <Marker
                coordinate={{
                  latitude: this.state.des.latitude,
                  longitude: this.state.des.longitude
                }}
              >
                <Icon name="pin" />
              </Marker>
            )}
        </MapView>

        <Card
          style={{
            position: "absolute",
            marginTop: 60,
            elevation: 6,
            width: "80%",
            padding: 30,
            flexDirection: "row",
            alignSelf: "center"
          }}
        >
          <Button onPress={this.openSearchModal}>
            <Text>{this.state.des.name}</Text>
            <Icon name="search" />
          </Button>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  button: {
    position: "absolute",
    elevation: 6,
    right: 0,
    left: 0,
    top: "50%"
  }
});
const mapStateToProps = state => {
  return {
    coords: state.trackDirection.coords
  };
};
export default connect(
  mapStateToProps,
  actions
)(TrackDirection);
