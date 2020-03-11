import React, { memo, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { fetchData } from './actions/dataActions';
import Toolbar from './components/Toolbar';
import Dashboard from './components/Dashboard';
import RealmConnections from './components/RealmConnections';

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
          <Router>
            <Toolbar />
            <Switch>
              <Route path="/realms">
                <RealmConnections />
              </Route>
              <Router path="/">
                <Dashboard />
              </Router>
            </Switch>
            <div style={{ background: '#222' }}>Footer</div>
          </Router>
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
