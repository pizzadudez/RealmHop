import React, { memo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import RealmSlide from './RealmSlide';

const stateSelector = createSelector(
  state => state.shardsById,
  shardsById => {
    const selectedIds = Object.entries(shardsById)
      .filter(([id, shard]) => shard.selected)
      .sort((a, b) => b[1].position - a[1].position)
      .map(([id, _]) => id);
    return {
      shardsById,
      selectedIds,
    };
  }
);

export default memo(() => {
  const dispatch = useDispatch();
  const { shardsById, selectedIds } = useSelector(stateSelector);

  return (
    <Container>
      {selectedIds.map(id => (
        <RealmSlide key={id} shard={shardsById[id]} />
      ))}
    </Container>
  );
});

const Container = styled.div`
  overflow: auto;
`;
