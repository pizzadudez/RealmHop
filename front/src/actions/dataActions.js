import axios from 'axios';
import {
  FETCH_ZONES,
  FETCH_SHARDS,
  LOADING_FINISHED,
  FETCH_ISSUES,
} from './types';

export const fetchData = () => dispatch => {
  axios
    .all([
      axios.get('/api/zones'),
      axios.get('/api/shards'),
      axios.get('/api/issues'),
    ])
    .then(
      axios.spread((zonesRes, shardsRes, issuesRes) => {
        dispatch({ type: FETCH_ZONES, payload: zonesRes.data });
        dispatch({ type: FETCH_SHARDS, payload: shardsRes.data });
        dispatch({ type: FETCH_ISSUES, payload: issuesRes.data });
        dispatch({ type: LOADING_FINISHED });
      })
    );
};
