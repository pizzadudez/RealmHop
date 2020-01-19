import { combineReducers } from 'redux';
import realmsReducer from './realmsReducer';
import issuesReducer from './issuesReducer';

export default combineReducers({
  realmsById: realmsReducer,
  issues: issuesReducer,
});