import './AppMenu.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { FaKeyboard, FiFilePlus, FiEdit } from "react-icons/all";
import { useMst } from 'context/Store';

const AppMenu = observer(({
    onSelect=() => {}
}) => {
    let { apps } = useMst();

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
                    <li key={'sidepane_app_' + a.id} className="app-menu-list-item">
                        <div onClick={() => selectApp(a.id)}><span><FaKeyboard/> {a.name}</span></div>
                        <div onClick={() => editApp(a.id)}><FiEdit/></div>
                    </li>
                ))}
            </ul>
        </nav>
    );
});

export default AppMenu;
