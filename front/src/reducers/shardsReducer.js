import {
  FETCH_SHARDS,
  SHARD_UPDATED,
  SHARDS_SORTED,
  SHARDS_SELECTED,
  SHARD_DESELECTED,
  SHARD_CONNECTED,
  SHARD_DISCONNECTED,
} from '../actions/types';

const initialState = {
  shardsById: {},
  orderedIds: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SHARDS:
      return {
        ...state,
        shardsById: action.payload,
        ...(action.initialFetch && {
          orderedIds: Object.values(action.payload)
            .filter(shard => shard.selected)
            .sort((a, b) => a.position - b.position)
            .map(shard => shard.id),
        }),
      };
    case SHARDS_SORTED:
      return {
        ...state,
        orderedIds: action.payload,
      };
    case SHARDS_SELECTED:
      return {
        ...state,
        orderedIds: action.insertLast
          ? [...state.orderedIds, ...action.ids]
          : [...action.ids, ...state.orderedIds],
      };
    case SHARD_DESELECTED:
      return {
        ...state,
        orderedIds: [
          ...state.orderedIds.slice(0, action.index),
          ...state.orderedIds.slice(action.index + 1),
        ],
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
        ...(parent.connected_with &&
          parent.connected_with.filter(id => id !== childId)),
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
