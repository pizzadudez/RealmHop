import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { SortableHandle } from 'react-sortable-hoc';

import {
  addIssue,
  connectShard,
  disconnectShard,
} from '../actions/shardActions';
import Button from './common/Button';

const DragHandle = SortableHandle(() => (
  <div style={{ background: 'grey', alignItems: 'center' }}>
    <span>||</span>
  </div>
));

const stateSelector = createSelector(
  state => state.issues,
  state => state.shards.shardsById,
  (issues, shardsById) => ({ issues, shardsById })
);

export default memo(({ shard, idx, openConnectShard, disableExpand }) => {
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
  const connect = useCallback(() => openConnectShard([shard.id, idx]), [
    shard.id,
    idx,
  ]);
  const deselectConnected = useCallback(
    () => dispatch(connectShard(shard.id, shard.connected_to, idx)),
    [dispatch, shard]
  );
  const disconnect = useCallback(
    () => dispatch(disconnectShard(shard.id, shard.connected_to)),
    [dispatch, shard]
  );

  return (
    <Container idx={idx} connected={!!shard.connected_to}>
      <Slide expand={!disableExpand}>
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
      <DragHandle />
    </Container>
  );
});

const Slide = styled.div`
  height: 50px;
  transition: height 0.15s ease-in-out;
  &:hover {
    height: ${props => (props.expand ? '150px' : undefined)};
  }

  background: ${props => (props.expand ? 'yellow' : 'tomato')};
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.5rem;
    margin: 0 3px;
  }
`;

const Container = styled.div`
  width: 240px;
  display: grid;
  grid-template-columns: 220px 20px;
  border: 1px solid black;
  margin-bottom: ${props => ((props.idx + 1) % 4 === 0 ? '10px' : undefined)};
  user-select: none;
`;
