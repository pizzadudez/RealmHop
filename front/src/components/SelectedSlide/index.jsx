import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { SortableHandle } from 'react-sortable-hoc';

import {
  addIssue,
  connectShard,
  disconnectShard,
  moveShard,
} from '../../actions/shardActions';
import IssueButton from './IssueButton';

const DragHandle = SortableHandle(() => <StyledDragHandle />);

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
  const disconnect = useCallback(
    () => dispatch(disconnectShard(shard.id, shard.connected_to)),
    [dispatch, shard]
  );
  const deselectConnected = useCallback(
    () => dispatch(connectShard(shard.id, shard.connected_to, idx)),
    [dispatch, shard]
  );
  const moveShardTo = useCallback(
    position => () => dispatch(moveShard(idx, position)),
    [dispatch, idx]
  );

  const connectedMenu = (
    <ExpandedMenu>
      <IssueButton onClick={disconnect}>Disconnect</IssueButton>
      <IssueButton onClick={deselectConnected}>Deselect</IssueButton>
    </ExpandedMenu>
  );

  return (
    <Container idx={idx} connected={!!shard.connected_to}>
      <Slide expand={!disableExpand} connected={shard.connected_to}>
        <Title>
          <span>{shard.realm.name}</span>
        </Title>
        {shard.connected_to ? (
          connectedMenu
        ) : (
          <ExpandedMenu>
            {shard.connected_with && (
              <div style={{ fontSize: '0.75rem' }}>
                {shard.connected_with.map(id => (
                  <span key={id} style={{ color: '#444', marginRight: 2 }}>
                    {shardsById[id].realm.name}
                  </span>
                ))}
              </div>
            )}
            {shard.group && (
              <IssueButton onClick={connect}>Connect With</IssueButton>
            )}
            <Issues>
              {issues.map(issue => (
                <IssueButton
                  key={issue.id}
                  onClick={addIssueHandlers[issue.id]}
                >
                  {issue.name}
                </IssueButton>
              ))}
            </Issues>
          </ExpandedMenu>
        )}
      </Slide>
      <StyledHandle>
        <div
          style={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: '50% 50%',
          }}
        >
          <button onClick={moveShardTo('top')}>&#8657;</button>
          <button onClick={moveShardTo('bottom')}>&#8659;</button>
          {/* <button onClick={moveShardTo()}>after</button> */}
        </div>
        <DragHandle />
      </StyledHandle>
    </Container>
  );
});

const Container = styled.div`
  width: 240px;
  display: grid;
  grid-template-columns: 200px 40px;
  border: 1px solid black;
  margin-bottom: ${props => ((props.idx + 1) % 4 === 0 ? '10px' : undefined)};
  user-select: none;
`;
const Slide = styled.div`
  max-height: 43px;
  transition: max-height 0.5s ease;
  padding: 3px 2px;
  background: ${props => (props.connected ? 'yellow' : 'tomato')};

  overflow: hidden;
  display: flex;
  flex-direction: column;
  &:hover {
    max-height: ${props => (props.expand ? '400px' : '46px')};
  }
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  height: 43px;
  margin-bottom: 3px;
  font-size: 1.5rem;
  > span {
    display: inline-block;
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
const ExpandedMenu = styled.div`
  display: flex;
  flex-direction: column;
`;
const Issues = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(53px, 1fr));
  column-gap: 3px;
  row-gap: 3px;
  margin-top: 3px;
`;

const StyledHandle = styled.div`
  background: grey;
  display: flex;
  button {
    padding: 2px;
  }
`;
const StyledDragHandle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &::after {
    content: '||';
    margin-bottom: 4px;
  }
`;
