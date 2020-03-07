import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { selectOne } from '../actions/shardActions';

export default memo(({ shard, idx }) => {
  const dispatch = useDispatch();

  const selectHandler = useCallback(
    (insertLast = false) => () => {
      dispatch(selectOne(shard.id, insertLast));
    },
    [dispatch, shard.id]
  );

  return (
    <Container idx={idx}>
      <Slide>{shard.realm.name}</Slide>
      <Menu>
        <button onClick={selectHandler()}>Top</button>
        <button onClick={selectHandler(true)}>Bottom</button>
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
  background: greenyellow;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;
const Container = styled.div`
  height: 38px;
  width: 180px;
  position: relative;
  background: palegoldenrod;
  border: 1px solid black;
  &:hover ${Menu} {
    opacity: 1;
  }
  margin-bottom: ${props => ((props.idx + 1) % 4 === 0 ? '10px' : undefined)};
`;
const Slide = styled.div``;
