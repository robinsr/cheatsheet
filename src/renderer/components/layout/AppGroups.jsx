import React from 'react';
import { observer } from 'mobx-react-lite';

import ShortcutCards from 'components/card/ShortcutCards.jsx';

import { useMst } from 'context/Store';

const fullScreenCenter = {
    width: '100%',
    height: '60vh',
    transform: 'scale(1.5)'
}

const SingleApp = ({ app }) => {
    return (
        <div key={'app_' + app.id}>
            <div className="my-2">
                <figure className="avatar avatar-md" data-initial={app.name[0].toUpperCase()} />
                <em className="h3 mx-2">{app.name}</em>
                <button className="btn btn-sm btn-primary s-circle float-right" onClick={() => app.addCategory()}>
                    <i className="icon icon-plus"></i>
                </button>
            </div>
            <ShortcutCards app={app} />
        </div>

    )
};

const AppGroups = observer(() => {
    let { apps, isLoading } = useMst();

    let selectedApp = apps.selectedApp;

    if (isLoading) {
        return (<div style={fullScreenCenter} className="loading loading-lg"></div>);
    }

    return (
        <div className="app-groups">
            { selectedApp
                ? <SingleApp app={selectedApp} />
                : apps.appList.map(app => <SingleApp app={app} />)
            }
        </div>
    );
});

export default AppGroups;
