
import './AppMenu.scss';

import React from 'react';
import styled, { css } from 'styled-components';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { FaKeyboard } from 'react-icons/fa';
import { FiEdit, FiFilePlus } from 'react-icons/fi';
import { PointerItem, SpaceBetweenItem } from 'components/theme';

const HoverItem = ({ cursor, $id, theme }) => css`
    color: ${cursor === $id ? theme.accent : 'unset'};
  
    &:hover {
        color: ${theme.accent} : 'unset';
    }
`
// night table row hover: rgb(29 29 77 / 10%)
const MenuItemList = styled.li`
    ${props => PointerItem(props)}
    ${props => HoverItem(props)}
    ${props => SpaceBetweenItem(props)}
    font-size: 0.9rem;
`;

const AppMenu = observer(({
    onSelect=() => {}
}) => {
    let { apps, cursor, setCursor } = useMst();

    function selectApp(appId) {
        apps.setActiveApp(appId);
        onSelect(appId);
    }

    function getListItemClasses(id) {
        return classnames('app-menu-list-item', {
            'active': id === cursor
        });
    }

    return (
        <nav className="app-menu">
            <div className="app-menu-title">
                <span className="h4">Apps</span>
                <span>
                    <FiFilePlus onClick={() => apps.addNewApp()}/>
                </span>
            </div>
            <ul className="app-menu-list">
                {apps.appList.map(a => (
                    <MenuItemList key={'spa'+a.id} $id={a.id} cursor={cursor}
                        className={getListItemClasses(a.id)}
                        onMouseEnter={() => setCursor(a.id)}>
                            <div onClick={() => selectApp(a.id)}>
                                <span><FaKeyboard/> {a.name}</span>
                            </div>
                            <div onClick={() => apps.setEditApp(a.id)}>
                                <FiEdit/>
                            </div>
                    </MenuItemList>
                ))}
            </ul>
        </nav>
    );
});

export default AppMenu;
