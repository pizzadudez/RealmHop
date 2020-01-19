import axios from 'axios';
import { FETCH_REALMS, FETCH_ISSUES } from './types';

export const fetchData = () => async dispatch => {
  await axios.all([
    axios.get('/api/realms'),
    axios.get('/api/issues')
  ]).then(axios.spread((realmsRes, issuesRes) => {
    const realmsById = arrayToMap(realmsRes.data);
    // const issuesById = arrayToMap(issuesRes.data);
    dispatch({ type: FETCH_REALMS, payload: realmsById });
    dispatch({ type: FETCH_ISSUES, payload: issuesRes.data });
  }));
};

/* Helpers */
const arrayToMap = arr => arr.reduce((obj, item) => ({
  ...obj,
  [item.id]: item,
}), {});