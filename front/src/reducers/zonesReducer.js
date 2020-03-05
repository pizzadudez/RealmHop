import { FETCH_ZONES } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_ZONES:
      return action.payload;
    default:
      return state;
  }
};
