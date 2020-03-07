import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { addIssue } from '../actions/shardActions';

const stateSelector = createSelector(
  state => state.issues,
  issues => ({ issues })
);

export default memo(({ shard }) => {
  const dispatch = useDispatch();
  const { issues } = useSelector(stateSelector);

  const addIssueHandlers = useMemo(() => {
    return Object.fromEntries(
      issues.map(issue => {
        const callback = () => dispatch(addIssue(shard.id, issue.id));
        return [issue.id, callback];
      })
    );
  }, [dispatch, shard.id, issues]);

  return (
    <Container>
      <Slide>{shard.realm.name}</Slide>
      <Menu>
        {issues.map(issue => (
          <button key={issue.id} onClick={addIssueHandlers[issue.id]}>
            {issue.name}
          </button>
        ))}
      </Menu>
    </Container>
  );
});

const Menu = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  position: absolute;
  z-index: 2;
  background: palevioletred;
`;
const Container = styled.div`
  height: 38px;
  width: 180px;
  position: relative;
  background: tomato;
  border: 1px solid black;
  &:hover ${Menu} {
    opacity: 1;
  }
`;
const Slide = styled.div``;
