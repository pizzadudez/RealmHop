import { combineReducers } from 'redux';
import realmsReducer from './realmsReducer';
import issuesReducer from './issuesReducer';

export default combineReducers({
  realms: realmsReducer,
  issues: issuesReducer,
});