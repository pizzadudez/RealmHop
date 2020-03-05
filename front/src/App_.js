import React, { memo, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import moment from 'moment';
import arrayMove from 'array-move';

import { fetchData } from './actions/dataActions';
import { updatePositions } from './actions/realmActions';
import SelectedSlide from './components/SelectedSlide';
import DeselectedSlide from './components/DeselectedSlide';

const SortableItem = SortableElement(({ value }) => 
  <SelectedSlide realm={value}/>
);
const SortableList = SortableContainer(({ realmsById, idList }) =>
  <ul>
    {idList.map((id, index) => (
      <SortableItem 
        key={id}
        index={index}
        value={realmsById[id]}
      />
    ))}
  </ul>
);

const stateSelector = createSelector(
  state => state.realmsById,
  state => state.app.updatingPositions,
  (realmsById, updatingPositions) => {
    const selected = Object.keys(realmsById)
      .filter(id => realmsById[id].selected)
      .sort((a, b) => realmsById[a].position - realmsById[b].position);
    const recent = Object.keys(realmsById)
      .filter(id => !realmsById[id].selected 
        && (moment(realmsById[id].updated_at) > moment().subtract(6, 'hours')))
    const old = Object.keys(realmsById)
      .filter(id => !realmsById[id].selected 
        && (moment(realmsById[id].updated_at) < moment().subtract(6, 'hours')))
    return ({
      realmsById,
      selected,
      recent,
      old,
      updatingPositions
    })
  }
);

export default memo(() => {
  const dispatch = useDispatch();
  const {
    realmsById,
    selected,
    recent,
    old,
    updatingPositions 
  } = useSelector(stateSelector);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);

  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    const newOrder = arrayMove(selected, oldIndex, newIndex);
    setOrder(newOrder);
    dispatch(updatePositions(newOrder));
  }, [selected, dispatch]);
  const updatePositionsHandler = useCallback(e => {
    e.preventDefault();
    dispatch(updatePositions(order, true));
  }, [dispatch, order]);

  useEffect(() => {
    dispatch(fetchData())
      .then(() => setLoading(false));
  }, [dispatch]);
  
  return (
    <div>
      {loading && <div>LOADING</div>}
      {!loading && (
        <>
          <button onClick={updatePositionsHandler}>
            {updatingPositions ? 'Updating...' : 'Update Positions'}
          </button>
          <div style={{ display: 'flex' }}>
            <SortableList
              realmsById={realmsById}
              idList={selected}
              onSortEnd={onSortEnd}
            />
            <ul>
              {recent.map(id => 
                <DeselectedSlide key={id} realm={realmsById[id]}/>
              )}
            </ul>
            <ul>
              {old.map(id => 
                <DeselectedSlide key={id} realm={realmsById[id]}/>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
});