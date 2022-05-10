import React from 'react';
import { observer } from 'mobx-react-lite';
import { ColumnContainer } from 'components/theme';

import ShortcutCard from './ShortcutCard.jsx';


const ShortcutCards = observer(({ app }) => {
    return (
        <ColumnContainer>
            {app.categories.map(group =>
                <ShortcutCard key={'shortcut-card-' + group.id} app={app} group={group} />
            )}
        </ColumnContainer>
    );
});

export default ShortcutCards;
