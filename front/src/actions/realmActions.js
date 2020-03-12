import axios from 'axios';
import { FETCH_GROUPS } from './types';

export const addRealmConnection = (first, second) => dispatch => {
  axios.post(`/api/realms/connections`, { first, second }).then(() => {
    axios
      .get('/api/realms/groups')
      .then(res => dispatch({ type: FETCH_GROUPS, payload: res.data }));
  });
};
export const removeRealmFromGroup = id => dispatch => {
  axios.delete(`/api/realm/${id}/connections`).then(() => {
    axios
      .get('/api/realms/groups')
      .then(res => dispatch({ type: FETCH_GROUPS, payload: res.data }));
  });
};
