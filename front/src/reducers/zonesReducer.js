import {
  FETCH_ZONES,
  FETCH_SHARDS,
  SELECT_ZONE,
  SET_ACTIVE_ZONE,
  SHARDS_SORTED,
  SHARDS_SELECTED,
  SHARD_DESELECTED,
} from '../actions/types';

const initialState = {
  activeId: null,
  selectedId: null,
  zonesById: {},
  shardOrders: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ZONES:
      return {
        ...state,
        zonesById: action.payload.zones,
        activeId: action.payload.active_zone_id,
        selectedId: action.payload.active_zone_id,
      };

    case SELECT_ZONE:
      return {
        ...state,
        selectedId: action.id,
      };
    case SET_ACTIVE_ZONE:
      return {
        ...state,
        activeId: action.id,
      };
    case FETCH_SHARDS: {
      // subsequent shard fetches are just for updating shard info
      if (!action.initialFetch) return state;
      const zones = Object.values(state.zonesById);
      const shardOrders = Object.fromEntries(
        zones.map(z => {
          return [
            z.id,
            z.shard_ids
              .filter(id => action.payload[id].selected)
              .sort((a, b) => a.position - b.position),
          ];
        })
      );
      return {
        ...state,
        shardOrders,
      };
    }
    case SHARDS_SORTED:
      return {
        ...state,
        shardOrders: {
          ...state.shardOrders,
          [state.selectedId]: action.payload,
        },
      };
    case SHARDS_SELECTED:
      return {
        ...state,
        shardOrders: {
          ...state.shardOrders,
          [state.selectedId]: action.insertLast
            ? [...state.shardOrders[state.selectedId], ...action.ids]
            : [...action.ids, ...state.shardOrders[state.selectedId]],
        },
      };
    case SHARD_DESELECTED:
      return {
        ...state,
        shardOrders: {
          ...state.shardOrders,
          [state.selectedId]: [
            ...state.shardOrders[state.selectedId].slice(0, action.index),
            ...state.shardOrders[state.selectedId].slice(action.index + 1),
          ],
        },
      };
    default:
      return state;
  }
};
