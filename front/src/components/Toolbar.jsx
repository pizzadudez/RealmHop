import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { createSelector } from 'reselect';

import { updatePositions } from '../actions/shardActions';
import { selectZone, setActiveZone } from '../actions/zoneActions';
import Button from './common/Button';

const stateSelector = createSelector(
  state => state.zones.zonesById,
  zonesById => ({ zones: Object.values(zonesById) })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { zones } = useSelector(stateSelector);

  const updatePositionsHandler = useCallback(
    () => dispatch(updatePositions()),
    [dispatch]
  );
  // TODO: set active zone elsewhere
  const selectZoneHandler = useCallback(
    id => () => {
      dispatch(selectZone(id));
      dispatch(setActiveZone(id));
    },
    [dispatch]
  );

  return (
    <Container>
      <Menu>
        <NavLink to="/realms">
          <Button>Realms</Button>
        </NavLink>
        {zones.map(zone => (
          <NavLink key={zone.id} to="/">
            <Button onClick={selectZoneHandler(zone.id)}>{zone.name}</Button>
          </NavLink>
        ))}
      </Menu>
      <Button onClick={updatePositionsHandler}>Update Positions</Button>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: #444;
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
