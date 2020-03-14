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
  <div
    style={{ background: 'grey', alignItems: 'center', cursor: 'row-resize' }}
  >
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
        <Title>
          <span>{shard.realm.name}</span>
          {/* {shard.connected_with && (
          <div style={{ fontSize: '0.75rem' }}>
            {shard.connected_with.map(id => (
              <span key={id} style={{ color: '#444', marginRight: 2 }}>
                {shardsById[id].realm.name}
              </span>
            ))}
          </div>
        )} */}
        </Title>
        <ExpandedMenu>
          <div style={{ height: 100, background: 'green' }}>lol</div>
          {idx % 2 === 0 && (
            <div style={{ height: 100, background: 'red' }}>lol</div>
          )}
        </ExpandedMenu>
      </Slide>
      <DragHandle />
    </Container>
  );
});

const Title = styled.div`
  font-size: 1.5rem;
  margin: 0 3px;
`;
const ExpandedMenu = styled.div`
  height: 0;
  opacity: 0;
  display: none;
  transition: all 1.25s ease-in-out;
  background: darkgrey;
`;
const Slide = styled.div`
  max-height: 46px;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  &:hover {
    max-height: ${props => (props.expand ? '400px' : undefined)};
    > ${ExpandedMenu} {
      height: auto;
      opacity: 1;
      display: flex;
      flex-direction: column;
    }
  }
  background: ${props => (props.expand ? 'yellow' : 'tomato')};
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 240px;
  display: grid;
  grid-template-columns: 220px 20px;
  border: 1px solid black;
  margin-bottom: ${props => ((props.idx + 1) % 4 === 0 ? '10px' : undefined)};
  user-select: none;
`;
