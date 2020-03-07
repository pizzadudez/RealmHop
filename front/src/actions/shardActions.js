import axios from 'axios';
import {
  SHARD_UPDATED,
  SHARD_CONNECTED,
  FETCH_SHARDS,
  SHARDS_SORTED,
  SHARD_DESELECTED,
  SHARDS_SELECTED,
} from './types';

export const addIssue = (shardId, issueId, index) => dispatch => {
  axios
    .post(`/api/shard/${shardId}/issues`, { issue_id: issueId })
    .then(res => {
      dispatch({ type: SHARD_DESELECTED, index });
      dispatch({ type: SHARD_UPDATED, payload: res.data });
    });
};
export const connectShard = (id, parentId) => dispatch => {
  axios.post(`/api/shard/${id}/connect`, { panret_id: parentId }).then(res => {
    dispatch({ type: SHARD_UPDATED, payload: res.data });
    dispatch({ type: SHARD_CONNECTED, id, parentId });
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
export const updatePositions = orderedIds => dispatch => {
  axios
    .post('/api/shards/positions', { ordered_ids: orderedIds })
    .then(res => dispatch({ type: FETCH_SHARDS, payload: res.data }));
};
