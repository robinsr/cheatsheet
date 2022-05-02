import React, { useEffect } from 'react';
import Logger from 'js-logger';
import { observer } from 'mobx-react-lite';
import { useMst } from 'context/Store.jsx';

const log = Logger.get('JSX/CursorNavigableForm');

const CursorNavigableForm = observer(({
    children, cursorNames
}) => {
    let { cursor, setCursor } = useMst();

    useEffect(() => {
        if (cursor?.startsWith('formNext_')) {
            let current = cursor.replace('formNext_', '');
            let next = cursorNames.indexOf(current) + 1 % cursorNames.length;
            log.debug('Moving to next form element', cursorNames[next]);
            setCursor(cursorNames[next]);
        }

        if (cursor?.startsWith('formPrev_')) {
            let current = cursor.replace('formPrev_', '');
            let next = cursorNames.indexOf(current) - 1 % cursorNames.length;
            log.debug('Moving to next form element', cursorNames[next])
            setCursor(cursorNames[next]);
        }
    }, [ cursor ]);

    log.debug(children);

    return (
        <form>
            {children}
        </form>
    );
})

export default CursorNavigableForm;
