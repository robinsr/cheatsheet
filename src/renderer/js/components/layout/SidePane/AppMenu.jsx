import React from 'react';
import { observer } from 'mobx-react-lite';
import { FiFilePlus, FiFile, FiEdit } from "react-icons/fi";
import { FaRegKeyboard } from "react-icons/fa";
import { useMst } from 'context/Store';

const AppMenu = observer(() => {
    let { apps } = useMst();

    function addNewApp() {
        apps.addNewApp()
    }

    function selectApp(appId) {
        apps.setActiveApp(appId);
    }

    function editApp(appId) {
        apps.setEditApp(appId);
    }

    return (
        <nav className="app-menu">
            <div className="app-menu-title">
               <h3>
                   Apps
                   <span className="pull-right">
                        <FiFilePlus onClick={addNewApp}/>
                   </span>
               </h3>
            </div>
            <table>
                <thead>
                <tr>
                    <th>AppName</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                    {apps.appList.map(a => (
                        <tr key={'sidepane_app_' + a.id}>
                            <td onClick={() => selectApp(a.id)}><span><FiFile/>{a.name}</span></td>
                            <td onClick={() => editApp(a.id)}><FiEdit/></td>
                        </tr>
                    ))}

                </tbody>

            </table>
        </nav>
    );
});

export default AppMenu;
