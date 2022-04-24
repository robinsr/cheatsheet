import React from 'react';
import { observer } from 'mobx-react-lite';
import * as _ from 'lodash';

import { useMst } from 'context/Store';
import ShortcutTable from './ShortcutTable';
import ShortcutCard from './ShortcutCard';


const ShortcutCards = observer(({ app }) => {

    let item_groups = app.categories

    return (
        <div className="shortcut-cards">
            {item_groups.map(group => 
                <ShortcutCard key={'shortcut-card-' + group.id} app={app} group={group} />
            )}
        </div>
    );
});

export default ShortcutCards;
