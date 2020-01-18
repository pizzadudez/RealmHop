import React, { memo, useState } from 'react';
import styled from 'styled-components';

import SelectedMenu from './SelectedMenu';

const Slide = styled.div`
  background-color: grey;
  border: 1px solid #585858;
  font-size: 1.5em;
  height: 40px;
  width: 250px;
  padding: 4px 6px;
  position: relative;
`;

export default memo(({
  realm
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Slide
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {showMenu
        ? <SelectedMenu realm={realm} />
        : <div>{realm.name}</div>
      }
    </Slide>
  );
});