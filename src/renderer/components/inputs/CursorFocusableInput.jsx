import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { getLogger } from 'utils';
import { TextInput, Select } from 'components/inputs';
import useCursor from '../../hooks/useCursor';

const log = getLogger('JSX/CursorFocusableElement', 'DEBUG');

/**
 * Sets active element to a specific input when cursor
 * value equals a given name.
 *
 * @param cursorName - value to match to trigger focus
 * @param {('text'|'select')} type - type of input (text or focus)
 * @param {boolean} [focus=false] - change cursor to value when element receives focus
 * @param {boolean} [blur=false] - active element should blur on cursor mismatch
 * @param {string} pattern - param matcher pattern
 * @param {string} [keyscope] - set keyscope on focus
 *
 */
const CursorFocusableInput = observer(({
    cursorName, pattern, type, focus=false, blur=false, children, ...rest
}) => {
    const isText = type === 'text';
    const isSelect = type === 'select';

    let { matches } = useCursor(pattern);
    let inputRef = null;

    let setInputRef = elem => {
        inputRef = elem;
    }

    useEffect(() => {
        if (matches && inputRef) {
            log.debug('setting focus', cursorName);
            isText && inputRef.focus();
            isText && inputRef.select();
        } else if (blur && inputRef) {
            inputRef.blur();
        }
    }, [ matches, inputRef ]);

    if (isText) {
        return (
            <TextInput ref={setInputRef} data-navname={cursorName} {...rest} />
        );
    }

    if (isSelect) {
        return (
            <Select ref={setInputRef} data-navname={cursorName} {...rest}>
                {children}
            </Select>
        );
    }

    log.error('Unrecognized input type:', type);

    return children;
});

export default CursorFocusableInput;
