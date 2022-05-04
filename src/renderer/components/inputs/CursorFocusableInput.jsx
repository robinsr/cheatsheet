import React, {useEffect, useRef} from 'react';
import { observer } from "mobx-react-lite";
import { useMst } from "store";
import { getLogger } from 'utils';

const log = getLogger('JSX/CursorFocusableElement');

/**
 * Sets active element to a specific input when cursor
 * value equals a given name.
 *
 * @param cursorName - value to match to trigger focus
 * @param {('text'|'select')} type - type of input (text or focus)
 * @param {boolean} [focus=false] - change cursor to value when element receives focus
 * @param {boolean} [blur=false] - active element should blur on cursor mismatch
 * @param {string} [keyscope] - set keyscope on focus
 *
 */
const CursorFocusableInput = observer(({
    cursorName, type, focus=false, blur=false, children, ...rest
}) => {
    let inputRef = useRef();
    let { cursor, setCursor } = useMst();

    useEffect(() => {
        if (cursor === cursorName) {
            log.debug('setting focus', cursorName);
            inputRef.current.focus();
        } else if (blur) {
            inputRef.current.blur();
        }
    }, [ cursor ]);

    function onFocus(e) {
        if (focus) setCursor(cursorName);
    }

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
