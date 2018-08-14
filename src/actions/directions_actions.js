import { GOT_DIRECTION } from "./types";
import { getDirections } from "./api_helpers";
export const getRoute = (origin, des) => async dispatch => {
  console.log("origin", origin);
  console.log("des", des);
  try {
    const coords = await getDirections(
      `${origin.lat},${origin.lng}`,
      `${des.lat},${des.lng}`
    );
    if (coords != null) {
      dispatch({ type: GOT_DIRECTION, payload: coords });
    }
  } catch (error) {
    console.warn(error);
  }
};
