import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
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
      <Menu>
        <NavLink to="/">
          <button>Main</button>
        </NavLink>
        <NavLink to="/realms">
          <button>Realms</button>
        </NavLink>
      </Menu>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: #444;
  button {
    height: 40px;
    min-width: 140px;
  }
`;
const Menu = styled.div`
  display: grid;
  grid-auto-flow: column;
  column-gap: 6px;
  padding: 0 12px;
  a {
    text-decoration: none;
  }
`;
