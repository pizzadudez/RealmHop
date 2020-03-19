import axios from 'axios';
import { SELECT_ZONE, SET_ACTIVE_ZONE } from './types';

export const selectZone = id => dispatch => {
  dispatch({ type: SELECT_ZONE, id });
};
export const setActiveZone = id => dispatch => {
  axios.post(`/api/zones/${id}/active`).then(() => {
    dispatch({ type: SET_ACTIVE_ZONE, id });
  });
};
