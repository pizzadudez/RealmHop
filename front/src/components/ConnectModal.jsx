import React, { memo, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';

import { connectShard } from '../actions/shardActions';
import Dialog from '@material-ui/core/Dialog';

const stateSelector = createSelector(
  state => state.shards.shardsById,
  shardsById => ({ shardsById })
);

export default memo(({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { shardsById } = useSelector(stateSelector);
  const [id, idx] = open;

  const connectList = useMemo(() => {
    if (id) {
      const selected = shardsById[id];
      return Object.values(shardsById).filter(
        shard =>
          shard.id !== selected.id &&
          shard.realm.region === selected.realm.region &&
          shard.realm.roleplay === selected.realm.roleplay &&
          !shard.connected_to
      );
    }
    return [];
  }, [id, shardsById]);
  const connect = useCallback(
    parentId => () => dispatch(connectShard(id, parentId, idx)),
    [id]
  );

  const close = useCallback(() => {
    setOpen([]);
  }, [setOpen]);

  return (
    <StyledDialog open={!!id} onClose={close}>
      {connectList.map(shard => (
        <button key={'connect-option-' + shard.id} onClick={connect(shard.id)}>
          {shard.realm.name}
        </button>
      ))}
    </StyledDialog>
  );
});

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #1f1f1f;
    border-radius: 4px;
    min-width: 600px;
    min-height: 700px;
    padding: 8px 10px;
    color: white;
  }
`;
