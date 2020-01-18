import axios from 'axios';
import { FETCH_REALMS, FETCH_ISSUES } from './types';

export const fetchData = () => async dispatch => {
  await axios.all([
    axios.get('/api/realms'),
    axios.get('/api/issues')
  ]).then(axios.spread((realmsRes, issuesRes) => {
    dispatch({ type: FETCH_REALMS, payload: realmsRes.data});
    dispatch({ type: FETCH_ISSUES, payload: issuesRes.data});
  }));
};