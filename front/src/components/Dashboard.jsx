import React, { memo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { sortShards, selectMany } from '../actions/shardActions';
import SelectedSlide from './SelectedSlide';
import DeselectedSlide from './DeselectedSlide';
import ConnectModal from './ConnectModal';

const stateSelector = createSelector(
  state => state.issues,
  state => state.zones,
  state => state.shards,
  (issues, { zonesById, selectedId, shardOrders }, { shardsById }) => {
    const shardIds = zonesById[selectedId].shard_ids;

    const unselected = shardIds
      .filter(id => !shardsById[id].selected && !shardsById[id].connected_to)
      .sort(
        (a, b) =>
          new Date(shardsById[a].issues[0].created_at) -
          new Date(shardsById[b].issues[0].created_at)
      )
      .reduce((obj, id) => {
        const issueType = shardsById[id].issues[0].type;
        obj[issueType] = obj[issueType] || [];
        obj[issueType].push(id);
        return obj;
      }, {});

    const connected = shardIds.filter(
      id => !shardsById[id].selected && shardsById[id].connected_to
    );

    // const unselected = Object.values(shardsById)
    //   .filter(shard => !shard.selected && !shard.connected_to)
    //   .sort(
    //     (a, b) =>
    //       new Date(a.issues[0].created_at) - new Date(b.issues[0].created_at)
    //   )
    //   .reduce((obj, shard) => {
    //     const issueType = shard.issues[0].type;
    //     obj[issueType] = obj[issueType] || [];
    //     obj[issueType].push(shard.id);

    //     return obj;
    //   }, {});
    // const connected = Object.values(shardsById)
    //   .filter(shard => !shard.selected && shard.connected_to)
    //   .map(shard => shard.id);

    return {
      issues,
      shardsById,
      orderedIds: shardOrders[selectedId],
      unselected,
      connected,
    };
  }
);

const SortableSlide = SortableElement(props => <SelectedSlide {...props} />);
const SortableList = SortableContainer(
  ({ ids, shardsById, openConnectShard, sorting }) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginRight: 18 }}>
      {ids.map((id, idx) => (
        <SortableSlide
          key={'sortable-slide-' + id}
          index={idx}
          idx={idx}
          shard={shardsById[id]}
          openConnectShard={openConnectShard}
          disableExpand={sorting}
        />
      ))}
    </div>
  )
);

export default memo(() => {
  const dispatch = useDispatch();
  const { issues, shardsById, orderedIds, unselected, connected } = useSelector(
    stateSelector
  );

  const [connectOpen, setConnectOpen] = useState([]); // [id, idx] (shard)

  const selectCategory = useCallback(
    category => () => {
      dispatch(selectMany(unselected[category]));
    },
    [dispatch, unselected]
  );
  const selectConnected = useCallback(() => dispatch(selectMany(connected)), [
    dispatch,
    connected,
  ]);

  const [sorting, setSorting] = useState(false);
  const onSortStart = useCallback(() => {
    setSorting(true);
  }, []);
  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      setSorting(false);
      const newOrder = arrayMove(orderedIds, oldIndex, newIndex);
      dispatch(sortShards(newOrder));
    },
    [dispatch, orderedIds]
  );

  return (
    <Container>
      <ConnectModal open={connectOpen} setOpen={setConnectOpen} />
      <div style={{ minHeight: 0, overflow: 'auto' }}>
        <SortableList
          ids={orderedIds}
          shardsById={shardsById}
          openConnectShard={setConnectOpen}
          sorting={sorting}
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          useDragHandle
          lockAxis="y"
        />
      </div>
      <Issues>
        {!!connected.length && (
          <IssueList key="connected">
            <button onClick={selectConnected}>Select All</button>
            <span>Connected</span>
            {connected.map(id => (
              <DeselectedSlide key={id} shard={shardsById[id]} />
            ))}
          </IssueList>
        )}
        {issues.map(
          issue =>
            unselected[issue.name] && (
              <IssueList key={issue.name}>
                <button onClick={selectCategory(issue.name)}>Select All</button>
                <span>{issue.name}</span>
                {unselected[issue.name].map(id => (
                  <DeselectedSlide key={id} shard={shardsById[id]} />
                ))}
              </IssueList>
            )
        )}
      </Issues>
    </Container>
  );
});

const Container = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: min-content 1fr;
`;
const Issues = styled.div`
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
`;
const IssueList = styled.div`
  min-height: 0;
  > span {
    color: white;
    font-size: 1.3rem;
    margin-left: 3px;
  }
`;
