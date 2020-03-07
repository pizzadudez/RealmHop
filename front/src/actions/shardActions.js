import axios from 'axios';
import { SHARD_UPDATED, SHARD_CONNECTED } from './types';

export const addIssue = (shardId, issueId) => dispatch => {
  axios
    .post(`/api/shard/${shardId}/issues`, { issue_id: issueId })
    .then(res => dispatch({ type: SHARD_UPDATED, payload: res.data }));
};
export const connectShard = (id, parentId) => dispatch => {
  axios.post(`/api/shard/${id}/connect`, { panret_id: parentId }).then(res => {
    dispatch({ type: SHARD_UPDATED, payload: res.data });
    dispatch({ type: SHARD_CONNECTED, id, parentId });
  });
};
