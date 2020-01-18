import { FETCH_REALMS } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_REALMS:
      return action.payload;
    default:
      return state;
  }
}