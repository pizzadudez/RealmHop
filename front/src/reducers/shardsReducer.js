import {
  FETCH_SHARDS,
  SHARD_UPDATED,
  SHARD_CONNECTED,
  SHARD_DISCONNECTED,
} from '../actions/types';

const initialState = {
  shardsById: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SHARDS:
      return {
        ...state,
        shardsById: action.payload,
      };
    case SHARD_UPDATED:
      return {
        ...state,
        shardsById: {
          ...state.shardsById,
          [action.payload.id]: action.payload,
        },
      };
    case SHARD_CONNECTED: {
      const { id: childId, parentId } = action;
      const parent = { ...state.shardsById[parentId] };
      parent.connected_with = [
        ...(parent.connected_with || []).filter(id => id !== childId),
        childId,
      ];

      return {
        ...state,
        shardsById: {
          ...state.shardsById,
          [parentId]: parent,
        },
      };
    }
    case SHARD_DISCONNECTED: {
      const { id: childId, parentId } = action;
      const parent = { ...state.shardsById[parentId] };
      parent.connected_with = [
        ...parent.connected_with.filter(id => id !== childId),
      ];

      return {
        ...state,
        shardsById: {
          ...state.shardsById,
          [parentId]: parent,
        },
      };
    }
    default:
      return state;
  }
};
