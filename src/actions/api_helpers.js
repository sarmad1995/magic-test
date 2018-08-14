import axios from "axios";
import Polyline from "@mapbox/polyline";
import { GOOGLE_MAPS_API_KEY } from "../config";

export const getDirections = async (origin, des) => {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${des}&key=${GOOGLE_MAPS_API_KEY}`
    );
    console.log("data", data);
    const points = Polyline.decode(data.routes[0].overview_polyline.points);
    const coords = points.map((point, index) => {
      return {
        latitude: point[0],
        longitude: point[1]
      };
    });
    console.log();
    console.log(data.routes[0].legs[0].duration.text);
    console.log("coords", coords.length);
    return coords;
  } catch (error) {
    return null;
  }
};
