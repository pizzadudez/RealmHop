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
  border-bottom: ${props => props.position === 15
    ? '5px solid black'
    : undefined
  };
`;

export default memo(({
  realm
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Slide
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      position={realm.position}
    >
      {showMenu
        ? <SelectedMenu realm={realm} />
        : <div>{realm.name}</div>
      }
    </Slide>
  );
});