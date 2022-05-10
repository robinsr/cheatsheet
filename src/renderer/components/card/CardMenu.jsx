import React from 'react';
import styled from 'styled-components';

export const CardMenu = ({ children }) => (
    <ul className="menu export-menu">
        {children}
    </ul>
);

const Link = styled.a`
  cursor: pointer;
`

export const MenuItem = ({ name, icon, onCLick }) => (
    <li className="menu-item">
        <Link onClick={onCLick}>
            <i className={'icon icon-' + icon}></i>
            <span className="mx-1">{name}</span>
        </Link>
    </li>
);


