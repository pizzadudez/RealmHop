import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { changeIsSelected } from '../actions/realmActions';

const IssueButton = styled.button`
  width: 30px;
  height: 30px;
`;

export default memo(({
  realm
}) => {
  const dispatch = useDispatch();
  const selectRealm = useCallback(() => e => {
    dispatch(changeIsSelected(realm))
  }, [dispatch, realm]);

  return (
    <div style={{ display: 'flex' }}>
      <IssueButton
        onClick={selectRealm()}
      >
        Select
      </IssueButton>
    </div>
  );
});