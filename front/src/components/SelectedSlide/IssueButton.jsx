import React, { memo } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';

export default memo(({ onClick, children, ...props }) => (
  <StyledButton variant="contained" onClick={onClick}>
    {children}
  </StyledButton>
));

const StyledButton = styled(Button)`
  &.MuiButton-root {
    padding: 2px;
    font-size: 0.75rem;
    text-transform: none;
    letter-spacing: normal;
    min-width: 0;
    border-radius: 3px;
  }
  & .MuiButton-label {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
