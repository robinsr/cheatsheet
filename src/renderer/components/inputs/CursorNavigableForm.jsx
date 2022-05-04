import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { getLogger } from 'utils';

const log = getLogger('JSX/CursorNavigableForm');

/**
 * Navigate a form with cursor values
 *
 * @param {string[]} cursorNames - list of cursor values present in this form
 *
 */
const CursorNavigableForm = observer(({
    cursorNames, children, ...rest
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
        <form onSubmit={e => e.preventDefault()} {...rest}>
            {children}
        </form>
    );
})

export default CursorNavigableForm;
