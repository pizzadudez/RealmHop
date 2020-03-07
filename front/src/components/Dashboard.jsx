import React, { memo, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { sortShards, selectMany } from '../actions/shardActions';
import SelectedSlide from './SelectedSlide';
import DeselectedSlide from './DeselectedSlide';

const stateSelector = createSelector(
  state => state.issues,
  state => state.shards,
  (issues, { shardsById, orderedIds }) => {
    const unselected = Object.values(shardsById)
      .filter(shard => !shard.selected)
      .sort(
        (a, b) =>
          new Date(b.issues[0].created_at) - new Date(a.issues[0].created_at)
      )
      .reduce((obj, shard) => {
        const issueType = shard.issues[0].type;
        obj[issueType] = obj[issueType] || [];
        obj[issueType].push(shard.id);

        return obj;
      }, {});
    return {
      issues,
      shardsById,
      orderedIds,
      unselected,
    };
  }
);

const SortableSlide = SortableElement(({ shard, idx }) => (
  <SelectedSlide shard={shard} idx={idx} />
));
const SortableList = SortableContainer(({ shardsById, ids }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    Selected
    <div>
      {ids.map((id, idx) => (
        <SortableSlide
          key={'sortable-slide-' + id}
          index={idx}
          idx={idx}
          shard={shardsById[id]}
        />
      ))}
    </div>
  </div>
));

export default memo(() => {
  const dispatch = useDispatch();
  const { issues, shardsById, orderedIds, unselected } = useSelector(
    stateSelector
  );

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const newOrder = arrayMove(orderedIds, oldIndex, newIndex);
      dispatch(sortShards(newOrder));
    },
    [dispatch, orderedIds]
  );

  const selectCategory = useCallback(
    category => () => {
      dispatch(selectMany(unselected[category]));
    },
    [dispatch, unselected]
  );

  return (
    <Container>
      <SortableList
        shardsById={shardsById}
        ids={orderedIds}
        onSortEnd={onSortEnd}
      />
      {issues.map(
        issue =>
          unselected[issue.name] && (
            <div key={issue.name}>
              {issue.name}
              <button onClick={selectCategory(issue.name)}>Select All</button>
              {unselected[issue.name].map(id => (
                <DeselectedSlide key={id} shard={shardsById[id]} />
              ))}
            </div>
          )
      )}
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  overflow: auto;
`;
