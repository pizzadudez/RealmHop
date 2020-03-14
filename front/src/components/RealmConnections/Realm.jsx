import React, { memo } from 'react';
import styled from 'styled-components';

export default memo(({ realm, group, onChange, checked }) => (
  <Container>
    <label>
      <input
        type="radio"
        name={group}
        value={realm.id}
        onChange={onChange}
        defaultChecked={false}
      />
      {realm.name}
      <div style={{ color: 'grey', fontSize: '0.8rem' }}>
        {realm.merged_realms}
      </div>
    </label>
  </Container>
));

const Container = styled.div`
  height: 60px;
  width: 200px;
  background: palegoldenrod;
  border: 1px solid black;
  user-select: none;
  > label {
    display: block;
    height: 100%;
    cursor: pointer;
    font-size: 1.2rem;
  }
`;
