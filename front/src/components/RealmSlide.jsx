import React, { memo } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

const stateSelector = createSelector(
  state => state.issues,
  issues => ({ issues })
);

export default memo(({ shard }) => {
  const dispatch = useDispatch();
  const { issues } = useSelector(stateSelector);

  return (
    <Container>
      <Slide>{shard.realm.name}</Slide>
      <Menu>
        {issues.map(issue => (
          <button key={issue.id}>{issue.name}</button>
        ))}
      </Menu>
    </Container>
  );
});

const Menu = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  position: absolute;
  z-index: 2;
  background: palevioletred;
`;
const Container = styled.div`
  height: 38px;
  width: 180px;
  position: relative;
  background: tomato;
  border: 1px solid black;
  &:hover ${Menu} {
    opacity: 1;
  }
`;
const Slide = styled.div``;
