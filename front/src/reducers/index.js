import { combineReducers } from 'redux';
import appReducer from './appReducer';
import shardsReducer from './shardsReducer';
import zonesReducer from './zonesReducer';
import issuesReducer from './issuesReducer';

export default combineReducers({
  app: appReducer,
  shards: shardsReducer,
  zones: zonesReducer,
  issues: issuesReducer,
});
