import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import { addIssue } from '../actions/realmActions';

const IssueButton = styled.button`
  width: 40px;
  height: 30px;
`;

const stateSelector = createSelector(
  state => state.issues,
  issues => ({ issues })
);

export default memo(({
  realm
}) => {
  const dispatch = useDispatch();
  const { issues } = useSelector(stateSelector);
  const addIssueHandler = useCallback(issueId => e => {
    dispatch(addIssue(realm.id, issueId))
  }, [dispatch, realm]);

  return (
    <div style={{ display: 'flex' }}>
      {issues.map(issue => (
        <IssueButton
          key={issue.id}
          color={issue.color}
          onClick={addIssueHandler(issue.id)}
        >
          {issue.name}
        </IssueButton>
      ))}
    </div>
  );
});