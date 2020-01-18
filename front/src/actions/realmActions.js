import axios from 'axios';
import { CHANGE_IS_SELECTED, UPDATE_REALM } from './types';

export const changeIsSelected = realm => async dispatch => {
  await axios.patch(`/api/realms/${realm.id}`, 
    { selected: !realm.selected }
  ).then(res => dispatch({ type: UPDATE_REALM , payload: res.data }));
};

export const addIssue = (realmId, issueId) => async dispatch => {
  await axios.post(`/api/realms/issues`, {
    realm_id: realmId, 
    issue_id: issueId
  }).then(res => dispatch({ type: UPDATE_REALM, payload: res.data }));
};

export const upvoteRealm = () => async dispatch => {

};