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
  realmsById => {
    const selected = Object.keys(realmsById)
      .filter(id => realmsById[id].selected)
      .sort((a, b) => {
        // handle null positions
        const x = realmsById[a].position !== null 
          ? realmsById[a].position 
          : Infinity;
        const y = realmsById[b].position !== null 
          ? realmsById[b].position 
          : Infinity;
        return x - y;
      });
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
      old
    })
  }
);

export default memo(() => {
  const dispatch = useDispatch();
  const { realmsById, selected, recent, old } = useSelector(stateSelector);
  const [loading, setLoading] = useState(true);

  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    // console.log(oldIndex, newIndex)
    // let newOrder = [...selected];
    // console.log(newOrder);
    // newOrder.splice(newIndex, 0, newOrder.splice(oldIndex, 1)[0]);
    // console.log(newOrder);
    const newOrder = arrayMove(selected, oldIndex, newIndex);
    dispatch(updatePositions(newOrder));
  }, [selected, dispatch]);

  useEffect(() => {
    dispatch(fetchData())
      .then(() => setLoading(false));
  }, [dispatch]);
  
  return (
    <div>
      {loading && <div>LOADING</div>}
      {!loading && (
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
      )}
    </div>
  );
});