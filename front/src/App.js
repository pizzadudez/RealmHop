import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchData } from './actions/dataActions'; 

const stateSelector = createSelector(
  state => state.realms,
  realms => ({ realms })
);

export default memo(() => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { realms } = useSelector(stateSelector);

  useEffect(() => {
    dispatch(fetchData())
      .then(() => setLoading(false));
  }, [dispatch]);
  
  return (
    <div>
      {loading && <div>loading</div>}
    </div>
  );
});