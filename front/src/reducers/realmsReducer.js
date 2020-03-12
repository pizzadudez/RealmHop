import { FETCH_REALMS, FETCH_GROUPS } from '../actions/types';

const initialState = {
  realmsById: {},
  groupsById: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REALMS:
      return {
        ...state,
        realmsById: action.payload,
      };
    case FETCH_GROUPS:
      return {
        ...state,
        groupsById: action.payload,
      };
    default:
      return state;
  }
};
