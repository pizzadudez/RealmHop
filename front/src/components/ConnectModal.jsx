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

  // const connectList = useMemo(() => {
  //   if (id) {
  //     const selected = shardsById[id];
  //     return;
  //     return Object.values(shardsById).filter(
  //       shard =>
  //         shard.id !== selected.id &&
  //         shard.realm.region === selected.realm.region &&
  //         shard.realm.roleplay === selected.realm.roleplay &&
  //         !shard.connected_to
  //     );
  //   }
  //   return [];
  // }, [id, shardsById]);
  const connect = useCallback(
    parentId => () => {
      dispatch(connectShard(id, parentId, idx));
      setOpen([]);
    },
    [id]
  );

  const close = useCallback(() => {
    setOpen([]);
  }, [setOpen]);

  return (
    <StyledDialog open={!!id} onClose={close}>
      {id &&
        shardsById[id].group.map(id => (
          <button key={'connect-option-' + id} onClick={connect(id)}>
            {`[${shardsById[id].realm.name}] - ${shardsById[id].realm.merged_realms}`}
          </button>
        ))}
      {!id && <div></div>}
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

  > button {
    font-size: 1.5rem;
  }
`;
