import { GOT_DIRECTION } from "../actions/types.js";

const INITIAL_STATE = {
  coords: null
};
export default function(state = INITIAL_STATE, action) {
  console.log(action);
  switch (action.type) {
    case GOT_DIRECTION:
      return { ...state, coords: action.payload };
    default:
      return state;
  }
}
