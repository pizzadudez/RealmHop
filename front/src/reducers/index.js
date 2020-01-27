import { combineReducers } from 'redux';
import realmsReducer from './realmsReducer';
import issuesReducer from './issuesReducer';
import appReducer from './appReducer';

export default combineReducers({
  realmsById: realmsReducer,
  issues: issuesReducer,
  app: appReducer
});