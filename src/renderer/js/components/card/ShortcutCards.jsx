import React from 'react';
import { observer } from 'mobx-react-lite';

import ShortcutCard from './ShortcutCard.jsx';


const ShortcutCards = observer(({ app }) => {
    return (
        <div className="shortcut-cards">
            {app.categories.map(group =>
                <ShortcutCard key={'shortcut-card-' + group.id} app={app} group={group} />
            )}
        </div>
    );
});

export default ShortcutCards;
