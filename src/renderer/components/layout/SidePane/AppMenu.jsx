import './AppMenu.scss';

import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { FaKeyboard } from 'react-icons/fa';
import { FiEdit, FiFilePlus } from 'react-icons/fi';
import { PointerItem, SpaceBetweenItem } from 'components/theme';
import Link from 'components/cursor/Link';
import { APP, EDIT_APP, IGNORE_APPS } from 'utils/paths';


const MenuItemList = styled.li`
    ${props => PointerItem(props)}
    ${props => SpaceBetweenItem(props)}
    font-size: 0.9rem;
  
    &:hover {
        color: ${p => p.theme.accent};
    }
`;

const AppMenu = observer(() => {
    let { apps } = useMst();

    return (
        <nav className="app-menu">
            <div className="app-menu-title">
                <span className="h4">Apps</span>
                <span>
                    <FiFilePlus onClick={() => apps.addNewApp()}/>
                </span>
            </div>
            <ul className="app-menu-list">
                {apps.appList.map(app => (
                    <MenuItemList key={app.id}>
                        <Link useReplace path={app.path}><span><FaKeyboard/> {app.name}</span></Link>
                        <Link useReplace path={app.path + '/edit'}><FiEdit/></Link>
                    </MenuItemList>
                ))}
            </ul>
            <section>
                <Link path={IGNORE_APPS.link()}>Ignore apps</Link>
            </section>
        </nav>
    );
});

export default AppMenu;
