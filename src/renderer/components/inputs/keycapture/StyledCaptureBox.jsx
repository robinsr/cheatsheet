import React from 'react';
import styled from 'styled-components';

const StyledCaptureBox = styled.div.attrs(props => ({

}))`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  
  color: ${props => props.theme.base.text};
  background-color: ${props => props.theme.capture.bg};
  border: 0.05rem dashed $dark-gray;
  border-radius: 0.1rem;
  
  font-size: 0.8rem;
  cursor: pointer;
  
  &:focus-visible {
      outline: none;
  }
  
  &.focus {
      outline: ${props => props.theme.accent} auto 1px;
  }
`;

export default StyledCaptureBox;
