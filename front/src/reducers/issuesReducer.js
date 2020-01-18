import { FETCH_ISSUES } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_ISSUES:
      return action.payload;
    default:
      return state;
  }
}