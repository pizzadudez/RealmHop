import axios from 'axios';
import {
  UPDATE_REALM,
  UPDATE_POSITIONS,
  UPDATING_POSITIONS_END,
  UPDATING_POSITIONS_START,
} from './types';

export const changeIsSelected = realm => async dispatch => {
  await axios.patch(`/api/realms/${realm.id}`, { 
    selected: !realm.selected,
    position: realm.selected ? null : realm.position
  }).then(res => dispatch({ type: UPDATE_REALM , payload: res.data }));
};

export const addIssue = (realmId, issueId) => async dispatch => {
  await axios.post(`/api/realms/issues`, {
    realm_id: realmId, 
    issue_id: issueId
  }).then(res => dispatch({ type: UPDATE_REALM, payload: res.data }));
};

export const updatePositions = (order, remote = false) => async dispatch => {
  dispatch({
    type: UPDATE_POSITIONS,
    payload: order
  });
  if (remote) {
    await dispatch({ type: UPDATING_POSITIONS_START })
    axios.post('/api/realms/positions', { order })
      .then(() => dispatch({ type: UPDATING_POSITIONS_END }))
  }
};

export const upvoteRealm = () => async dispatch => {

};