import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchData } from './actions/dataActions';
import SelectedSlide from './components/SelectedSlide';
import DeselectedSlide from './components/DeselectedSlide';

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
      {loading && <div>LOADING</div>}
      {!loading && (
        <div style={{ display: 'flex' }}>
          <ul>
            {realms.map(realm => realm.selected && (
              <SelectedSlide key={realm.id} realm={realm}/>
            ))}
          </ul>
          <ul>
            {realms.map(realm => !realm.selected && (
              <DeselectedSlide key={realm.id} realm={realm}/>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});