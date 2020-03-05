import {
  UPDATING_POSITIONS_START,
  UPDATING_POSITIONS_END,
  LOADING_FINISHED,
} from '../actions/types';

const initialState = {
  loadingData: true,
  updatingPositions: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_FINISHED:
      return {
        ...state,
        loadingData: false,
      };
    case UPDATING_POSITIONS_START:
      return {
        ...state,
        updatingPositions: true,
      };
    case UPDATING_POSITIONS_END:
      return {
        ...state,
        updatingPositions: false,
      };
    default:
      return state;
  }
};
