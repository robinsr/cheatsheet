import './AppMenu.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { FaKeyboard, FiFilePlus, FiEdit } from "react-icons/all";
import { useMst } from 'store';
import classnames from 'classnames';

const AppMenu = observer(({
    onSelect=() => {}
}) => {
    let { apps, cursor, setCursor } = useMst();

    function addNewApp() {
        apps.addNewApp()
    }

    function selectApp(appId) {
        apps.setActiveApp(appId);
        onSelect(appId);
    }

    function editApp(appId) {
        apps.setEditApp(appId);
    }

    function makeActive(id) {
        setCursor(id);
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
                    <FiFilePlus onClick={addNewApp}/>
                </span>
            </div>
            <ul className="app-menu-list">
                {apps.appList.map(a => (
                    <li key={'sidepane_app_' + a.id}
                        className={getListItemClasses(a.id)}
                        onMouseEnter={() => makeActive(a.id)}>
                            <div onClick={() => selectApp(a.id)}>
                                <span><FaKeyboard/> {a.name}</span>
                            </div>
                            <div onClick={() => editApp(a.id)}>
                                <FiEdit/>
                            </div>
                    </li>
                ))}
            </ul>
        </nav>
    );
});

export default AppMenu;
