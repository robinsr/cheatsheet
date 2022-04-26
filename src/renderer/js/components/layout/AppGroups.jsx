import React from 'react';
import { observer } from 'mobx-react-lite';

import ShortcutCards from 'components/card/ShortcutCards.jsx';

import { useMst } from 'context/Store.jsx';

const AppGroups = observer(() => {
    let { apps } = useMst();


    return (
        <div className="app-groups">
            {apps.map(a => (
                <div key={'app_' + a.name}>
                    <div className="my-2">
                        <figure className="avatar avatar-md" data-initial={a.name[0].toUpperCase()} />
                        <em className="h3 mx-2">{a.name}</em>
                    </div>
                    <ShortcutCards app={a} />
                </div>
            ))}
        </div>
    );
});

export default AppGroups;
