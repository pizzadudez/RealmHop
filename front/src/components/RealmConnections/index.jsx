import React, { memo, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import {
  addRealmConnection,
  removeRealmFromGroup,
} from '../../actions/realmActions';
import Realm from './Realm';
import SearchField from '../common/SearchField';

const stateSelector = createSelector(
  state => state.realms,
  ({ realmsById, groupsById }) => {
    const withoutGroupIds = Object.values(realmsById)
      .filter(realm => !realm.group_id)
      .reduce((obj, realm) => {
        obj[realm.region] = obj[realm.region] || [];
        obj[realm.region].push(realm.id);
        return obj;
      }, {});
    return { realmsById, groupsById, withoutGroupIds };
  }
);

export default memo(() => {
  const dispatch = useDispatch();
  const { realmsById, groupsById, withoutGroupIds } = useSelector(
    stateSelector
  );

  // Select
  const [leftSelected, setLeftSelected] = useState(null);
  const [rightSelected, setRightSelected] = useState(null);

  const selectLeft = useCallback(e => {
    setLeftSelected(parseInt(e.target.value));
    setRightSelected(null);
  }, []);
  const selectRight = useCallback(
    e => setRightSelected(parseInt(e.target.value)),
    []
  );

  // Filter
  const [leftFilter, setLeftFilter] = useState('');
  const [rightFilter, setRightFilter] = useState('');
  const filterLeft = useCallback(
    e => setLeftFilter(e.target.value.toLowerCase()),
    []
  );
  const filterRight = useCallback(
    e => setRightFilter(e.target.value.toLowerCase()),
    []
  );
  const leftRealms = useMemo(
    () =>
      Object.values(realmsById).filter(realm => {
        const { name, connected_realms } = realm;
        return [name, connected_realms].some(
          field => field && field.toLowerCase().includes(leftFilter)
        );
      }),
    [leftFilter, realmsById]
  );
  const rightRealms = useMemo(() => {
    if (leftSelected) {
      const leftRealm = realmsById[leftSelected];
      return Object.values(realmsById)
        .filter(
          realm =>
            realm.name !== leftRealm.name &&
            realm.roleplay === leftRealm.roleplay &&
            realm.region === leftRealm.region
        )
        .filter(realm => {
          const { name, connected_realms } = realm;
          return [name, connected_realms].some(
            field => field && field.toLowerCase().includes(rightFilter)
          );
        });
    } else {
      return [];
    }
  }, [leftSelected, rightFilter, realmsById]);

  // Actions
  const connect = useCallback(() => {
    dispatch(addRealmConnection(leftSelected, rightSelected));
    setLeftSelected(null);
    setRightSelected(null);
  }, [dispatch, leftSelected, rightSelected]);
  const disconnect = useCallback(
    id => () => dispatch(removeRealmFromGroup(id)),
    [dispatch]
  );

  return (
    <Container>
      <RealmColumn>
        <SearchField label="Search" onChange={filterLeft} />
        <List>
          {leftRealms.map(realm => (
            <Realm
              key={'first' + realm.id}
              realm={realm}
              onChange={selectLeft}
              group="first"
              checked={leftSelected === realm.id ? true : false}
            />
          ))}
        </List>
      </RealmColumn>
      <RealmColumn>
        <SearchField label="Search" onChange={filterRight} />
        <List>
          {rightRealms.map(realm => (
            <Realm
              key={'second' + realm.id}
              realm={realm}
              onChange={selectRight}
              group="second"
              checked={rightSelected === realm.id ? true : false}
            />
          ))}
        </List>
      </RealmColumn>
      <SelectedActions>
        <span>{leftSelected && realmsById[leftSelected].name}</span>
        {leftSelected && rightSelected && (
          <button onClick={connect}>Connect</button>
        )}
        <span>{rightSelected && realmsById[rightSelected].name}</span>
      </SelectedActions>
      <Groups>
        {Object.entries(groupsById).map(([groupId, realmIds]) => (
          <React.Fragment key={'group_' + groupId}>
            <h3>{`${groupId}, ${realmsById[realmIds[0]].region}`}</h3>
            <ul>
              {realmIds.map(id => (
                <li key={'group_realm_' + id}>
                  {realmsById[id].name}
                  <button onClick={disconnect(id)}>X</button>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </Groups>
      <Groups>
        {Object.entries(withoutGroupIds).map(([region, realmIds]) => (
          <React.Fragment key={region}>
            <h3>{`${region}: `}</h3>
            <ul>
              {realmIds.map(id => (
                <li key={'ungrouped_realm' + id}>
                  <span>{realmsById[id].name}</span>
                  <span>{realmsById[id].merged_realms}</span>
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </Groups>
    </Container>
  );
});

const Container = styled.div`
  min-height: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
`;
const RealmColumn = styled.div`
  width: 220px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 100px;
`;
const List = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-right: 18px;
`;
const SelectedActions = styled.div`
  color: white;
  font-size: 1.4rem;
  button {
    width: 80px;
    height: 30px;
  }
`;
const Groups = styled.div`
  min-width: 300px;
  margin-left: 50px;
  color: #dcdcdc;
  overflow: auto;
  > h3 {
    margin: 12px 0 6px;
    white-space: nowrap;
  }
  > ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    li {
      button {
        margin-left: 8px;
      }
      > span:first-child {
        color: white;
        margin-right: 4px;
      }
      > span:last-child {
        color: grey;
      }
    }
  }
`;
