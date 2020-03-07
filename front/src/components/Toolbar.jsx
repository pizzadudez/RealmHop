import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { updatePositions } from '../actions/shardActions';

const stateSelector = createSelector(
  state => state.shards.orderedIds,
  orderedIds => ({ orderedIds })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { orderedIds } = useSelector(stateSelector);

  const updatePositionsHandler = useCallback(
    () => dispatch(updatePositions(orderedIds)),
    [dispatch, orderedIds]
  );

  return (
    <Container>
      <button onClick={updatePositionsHandler}>Update Positions</button>
    </Container>
  );
});

const Container = styled.div`
  background: #444;
`;
