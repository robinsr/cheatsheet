import React from 'react';
import styled from 'styled-components';
import { FaUndo } from "react-icons/fa";

const UndoButton = styled.button.attrs(props => ({
    className: 'btn btn-small btn-link',
    type: 'button',
    tabIndex: -1,
    children: <FaUndo/>
}))`
    position: absolute;
    left: 0;
    top: 0;
  
    svg {
      color: ${props => props.theme.accent};
    }
`;

export default UndoButton;
