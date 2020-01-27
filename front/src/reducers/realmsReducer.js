import { FETCH_REALMS, UPDATE_REALM, UPDATE_POSITIONS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_REALMS:
      return action.payload;
    case UPDATE_REALM:
      return {
        ...state,
        [action.payload.id]: action.payload
      }
    case UPDATE_POSITIONS: {
      const newState = { ...state };
      action.payload.forEach((id, idx) => newState[id] = {
        ...newState[id],
        position: idx
      });
      return newState;
    }
    default:
      return state;
  }
}