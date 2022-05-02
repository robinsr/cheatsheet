import React, {useEffect, useRef} from 'react';
import { observer } from "mobx-react-lite";
import { useMst } from "store";
import classnames from "classnames";
import { getLogger } from 'utils';

const log = getLogger('JSX/CursorFocusableElement');

const CursorFocusableInput = observer(({
    cursorName, className, children, type, ...rest
}) => {
    let inputRef = useRef();
    let { cursor, setCursor } = useMst();

    useEffect(() => {
        if (cursor === cursorName) {
            log.debug('setting focus', cursorName);
            inputRef.current.focus();
        } else {
            inputRef.current.blur();
        }
    }, [ cursor ]);

    function onFocus(e) {
        setCursor(cursorName);
    }

    rest.className = classnames('cursor-focusable-element', className);

    if (type === 'text') {
        return (
            <input type="type" ref={inputRef} data-navname={cursorName} {...rest} />
        );
    }

    if (type === 'select') {
        return (
            <select ref={inputRef} data-navname={cursorName} {...rest}>
                {children}
            </select>
        );
    }

    log.error('Unrecognized input type:', type);

    return children;
});

export default CursorFocusableInput;
