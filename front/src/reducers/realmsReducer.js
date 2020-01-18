import { FETCH_REALMS, UPDATE_REALM } from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_REALMS:
      return action.payload;
    case UPDATE_REALM:
      return state.map(realm => realm.id === action.payload.id
        ? action.payload
        : realm
      )
    default:
      return state;
  }
}