import axios from 'axios';
import {
  FETCH_SHARDS,
  SHARD_UPDATED,
  SHARD_CONNECTED,
  SHARD_DISCONNECTED,
  SHARDS_SORTED,
  SHARD_DESELECTED,
  SHARDS_SELECTED,
} from './types';
import arrayMove from 'array-move';

export const addIssue = (shardId, issueId, index) => dispatch => {
  axios
    .post(`/api/shard/${shardId}/issues`, { issue_id: issueId })
    .then(res => {
      dispatch({ type: SHARD_DESELECTED, index });
      dispatch({ type: SHARD_UPDATED, payload: res.data });
    });
};
export const connectShard = (id, parentId, index) => dispatch => {
  axios.post(`/api/shard/${id}/connect`, { parent_id: parentId }).then(res => {
    dispatch({ type: SHARD_UPDATED, payload: res.data });
    dispatch({ type: SHARD_DESELECTED, index });
    dispatch({ type: SHARD_CONNECTED, id, parentId });
  });
};
export const disconnectShard = (id, parentId) => dispatch => {
  axios.delete(`/api/shard/${id}/disconnect`).then(res => {
    dispatch({ type: SHARD_UPDATED, payload: res.data });
    dispatch({ type: SHARD_DISCONNECTED, id, parentId });
  });
};

export const selectOne = (shardId, insertLast = false) => dispatch => {
  axios
    .post(`/api/shard/${shardId}/select`, { insert_last: insertLast })
    .then(res => {
      dispatch({ type: SHARDS_SELECTED, ids: [shardId], insertLast });
      dispatch({ type: SHARD_UPDATED, payload: res.data });
    });
};
export const selectMany = (shardIds, insertLast = false) => dispatch => {
  axios
    .post('/api/shards/select', {
      shard_ids: shardIds,
      insert_last: insertLast,
    })
    .then(res => {
      dispatch({ type: SHARDS_SELECTED, ids: shardIds, insertLast });
      dispatch({ type: FETCH_SHARDS, payload: res.data });
    });
};

export const sortShards = orderedIds => dispatch => {
  dispatch({ type: SHARDS_SORTED, payload: orderedIds });
};
export const updatePositions = () => (dispatch, getState) => {
  const selectedZoneId = getState().zones.selectedId;
  const orderedIds = getState().zones.shardOrders[selectedZoneId];
  axios
    .post('/api/shards/positions', { ordered_ids: orderedIds })
    .then(res => dispatch({ type: FETCH_SHARDS, payload: res.data }));
};

export const moveShard = (index, position = null) => (dispatch, getState) => {
  const selectedZoneId = getState().zones.selectedId;
  const orderedIds = getState().zones.shardOrders[selectedZoneId];

  let newIndex;
  if (position === 'top') newIndex = 0;
  else if (position === 'bottom') newIndex = orderedIds.length - 1;
  else newIndex = 0; // placeholder for insert after first 'n'

  const newOrder = arrayMove(orderedIds, index, newIndex);
  dispatch({ type: SHARDS_SORTED, payload: newOrder });
};
