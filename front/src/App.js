import React, { memo, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchData } from './actions/dataActions';
import Dashboard from './components/Dashboard';
import Toolbar from './components/Toolbar';

const stateSelector = createSelector(
  state => state.app.loadingData,
  loadingData => ({ loadingData })
);

export default memo(() => {
  const dispatch = useDispatch();
  const { loadingData } = useSelector(stateSelector);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return (
    <>
      {!loadingData && (
        <Page>
          <Toolbar />
          <Dashboard />
          <div style={{ background: '#222' }}>Footer</div>
        </Page>
      )}
      {loadingData && <div>Loading</div>}
    </>
  );
});

const Page = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 50px 1fr 20px;
`;
