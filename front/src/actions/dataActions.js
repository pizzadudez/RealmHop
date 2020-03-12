import axios from 'axios';
import {
  FETCH_ZONES,
  FETCH_SHARDS,
  FETCH_ISSUES,
  FETCH_REALMS,
  FETCH_GROUPS,
  LOADING_FINISHED,
} from './types';

export const fetchData = () => dispatch => {
  axios
    .all([
      axios.get('/api/zones'),
      axios.get('/api/issues'),
      axios.get('/api/shards'),
      axios.get('/api/realms'),
      axios.get('/api/realms/groups'),
    ])
    .then(
      axios.spread((zonesRes, issuesRes, shardsRes, realmsRes, groupsRes) => {
        dispatch({ type: FETCH_ZONES, payload: zonesRes.data });
        dispatch({ type: FETCH_ISSUES, payload: issuesRes.data });
        dispatch({
          type: FETCH_SHARDS,
          payload: shardsRes.data,
          initialFetch: true,
        });
        dispatch({ type: FETCH_REALMS, payload: realmsRes.data });
        dispatch({ type: FETCH_GROUPS, payload: groupsRes.data });
        dispatch({ type: LOADING_FINISHED });
      })
    );
};
