import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'context/Store';

const AppMenu = observer(() => {
    let { apps } = useMst();

    return (
        <nav className="nav-group">
            <h5 className="nav-group-title">Apps</h5>
            {apps.map(a => (
                <a key={'sidepane_app_' + a.id} className="nav-group-item active">
                    <span className="icon icon-keyboard"></span>
                    {a.name}
                </a>
            ))}
        </nav>
    );
});

export default AppMenu;
