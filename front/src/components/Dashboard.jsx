import React, { memo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import RealmSlide from './RealmSlide';

const stateSelector = createSelector(
  state => state.issues,
  state => state.shardsById,
  (issues, shardsById) => {
    const selected = Object.values(shardsById)
      .filter(shard => shard.selected)
      .sort((a, b) => b.position - a.position)
      .map(shard => shard.id);
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
      selected,
      unselected,
    };
  }
);

export default memo(() => {
  const dispatch = useDispatch();
  const { issues, shardsById, selected, unselected } = useSelector(
    stateSelector
  );

  return (
    <Container>
      <div>
        Selected
        {selected.map(id => (
          <RealmSlide key={id} shard={shardsById[id]} />
        ))}
      </div>
      {issues.map(issue => (
        <div key={issue.name}>
          {issue.name}
          {unselected[issue.name].map(id => (
            <RealmSlide key={id} shard={shardsById[id]} />
          ))}
        </div>
      ))}
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  overflow: auto;
`;
