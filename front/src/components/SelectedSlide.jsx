import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { addIssue } from '../actions/shardActions';

const stateSelector = createSelector(
  state => state.issues,
  state => state.shards.shardsById,
  (issues, shardsById) => ({ issues, shardsById })
);

export default memo(({ shard, idx, connectShard }) => {
  const dispatch = useDispatch();
  const { issues, shardsById } = useSelector(stateSelector);

  const addIssueHandlers = useMemo(() => {
    return Object.fromEntries(
      issues.map(issue => {
        const callback = () => dispatch(addIssue(shard.id, issue.id, idx));
        return [issue.id, callback];
      })
    );
  }, [dispatch, shard.id, idx, issues]);
  const connect = useCallback(() => connectShard([shard.id, idx]), [
    shard.id,
    idx,
  ]);

  return (
    <Container idx={idx}>
      <Slide>
        <span>{shard.realm.name}</span>
        {shard.connected_with && (
          <div style={{ fontSize: '0.75rem' }}>
            {shard.connected_with.map(id => (
              <span key={id} style={{ color: '#444', marginRight: 2 }}>
                {shardsById[id].realm.name}
              </span>
            ))}
          </div>
        )}
      </Slide>
      <Menu>
        {issues.map(issue => (
          <button key={issue.id} onClick={addIssueHandlers[issue.id]}>
            {issue.name}
          </button>
        ))}
        <button onClick={connect}>CONNECT</button>
      </Menu>
    </Container>
  );
});

const Menu = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  z-index: 3;
  background: palevioletred;
  display: flex;
  flex-wrap: wrap;
`;
const Container = styled.div`
  height: 44px;
  width: 260px;
  position: relative;
  background: tomato;
  border: 1px solid black;
  &:hover ${Menu} {
    opacity: 1;
  }
  margin-bottom: ${props => ((props.idx + 1) % 4 === 0 ? '10px' : undefined)};
`;
const Slide = styled.div``;