import { UPDATING_POSITIONS_START, UPDATING_POSITIONS_END } from "../actions/types"

const initialState = {
  updatingPositions: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATING_POSITIONS_START:
      return {
        ...state,
        updatingPositions: true
      }
    case UPDATING_POSITIONS_END:
      return {
        ...state,
        updatingPositions: false
      }
    default:
      return state;
  }
}