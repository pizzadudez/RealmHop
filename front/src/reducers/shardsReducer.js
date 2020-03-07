import {
  FETCH_SHARDS,
  SHARD_UPDATED,
  UPDATE_POSITIONS,
  SHARD_CONNECTED,
} from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_SHARDS:
      return action.payload;
    case SHARD_UPDATED:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case SHARD_CONNECTED: {
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          connected_with: [
            ...(state[action.parentId].connected_with || []),
            action.id,
          ],
        },
      };
    }
    // case UPDATE_POSITIONS: {
    //   const newState = { ...state };
    //   action.payload.forEach(
    //     (id, idx) =>
    //       (newState[id] = {
    //         ...newState[id],
    //         position: idx,
    //       })
    //   );
    //   return newState;
    // }
    default:
      return state;
  }
};
