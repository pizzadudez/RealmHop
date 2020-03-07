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
      return {
        ...state,
        shardsById: {
          ...state.shardsById,
          [action.parentId]: {
            ...state.shardsById[action.parentId],
            connected_with: [
              ...(state.shardsById[action.parentId].connected_with || []),
              action.id,
            ],
          },
        },
      };
    }
    case SHARD_DISCONNECTED: {
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          connected_with: state[action.parentId].connected_with.filter(
            id => id !== action.id
          ),
        },
      };
    }
    default:
      return state;
  }
};
