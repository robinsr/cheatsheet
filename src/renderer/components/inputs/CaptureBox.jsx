import './CaptureBox.scss';

import React, { useEffect, useRef, useState } from 'react';
import { FaUndo } from "react-icons/fa";
import hotkeys from 'hotkeys-js';
import { observer } from "mobx-react-lite";
import classnames from "classnames";
import { useMst } from "store";

import ShortcutKey from 'components/card/ShortcutKey';

import {
    captureActions,
    getCaptureAction,
    getKeyString,
    getLogger,
    isTabKey,
    key_scopes,
    KeyEmitter
} from 'utils';


const log = getLogger('JSX/CaptureBox');
const hotkeysConfig = key_scopes.CAPTURE.config;

const UndoButton = ({ onClick }) => {

    let styles = {
        opacity: '1',
        position: 'absolute',
        top: 0,
        left: 0
    };

    return (
        <button type="button" className={'btn btn-small btn-link'} style={styles} onClick={onClick} tabIndex={-1}>
            <FaUndo color={'#5755d9'} />
        </button>
    );
}

const CaptureBox = observer(({
    defaultValue, command, cursorName, tabNext, onData
}) => {
    let { cursor, setCursor } = useMst();
    let ref = useRef();

    let [ status, setStatus ] = useState('blur');
    let [ keyString, setKeyString ] = useState(null);

    useEffect(() => {
        if (cursor === cursorName){
            log.debug('Focusing:', cursorName);
            ref.current?.focus();
        }
    }, [ cursor ]);

    const onClick = (e) => {
        if (cursorName && cursor !== cursorName) {
            setCursor(cursorName);
        }
    }

    let cns = classnames('new-shortcut-box', 'text-gray', {
        'focus': status === 'focus'
    });


    const startCapture = () => {
        log.debug("Capturing");

        let kb_string = '';
        
        hotkeys('*', hotkeysConfig, (e) => {
            log.debug('Found event:', getKeyString(e))

            switch (getCaptureAction(e)) {
                case captureActions.EXIT:
                    // let the tab event bubble up
                    log.debug('tab out', status);
                    break;
                case captureActions.CAPTURE:
                    kb_string = getKeyString(e);

                    e.stopPropagation();
                    e.preventDefault();
                    break;
                case captureActions.SAVE:
                    log.debug('setting state', kb_string)
                    setKeyString(kb_string);

                    e.stopPropagation();
                    e.preventDefault();
                    break;
            }
        });

        KeyEmitter.setScope('CAPTURE', 'JSX/CaptureBox');
        setStatus('focus');
    }

    const stopCapture = (e, tab_out=false, discard=false) => {
        log.debug("End capturing", {
            status, keyString, defaultValue
        });
        hotkeys.unbind('*' ,'CAPTURE');
        // hotkeys.deleteScope('CAPTURE')
        KeyEmitter.setScope('EDIT_ITEM', 'JSX/CaptureBox');

        if (discard) return;

        if (keyString == null || keyString === defaultValue) {
            // nothing captured, do nothing
            log.debug('No change detected');
        } else {
            log.debug('Emitting onData value:', keyString);
            onData(keyString);
            setKeyString(null);
        }

        setStatus('blur');

        if (isTabKey(e) && tabNext) {
            tabNext.current?.focus();
        }
    }

    // New shortcut,
    const undo = () => {
        log.warn('Undoing!');

        if (keyString !== null && command !== null) {
            setKeyString(null);
        } else {
            setKeyString(null);
            onData(defaultValue);
        }
    }

    /**
     * Order precedence:
     * keyString (unsaved input) > command (saved to edit model) > defaultValue (saved to model)
     */
    return (
        <div style={{position: "relative"}} onBlur={stopCapture} onClick={onClick}>
            <div className={cns}
                 tabIndex="0"
                 id="capture-box"
                 ref={ref}
                 onFocus={startCapture}>
                {keyString !== null
                    ? <ShortcutKey command={keyString} />
                    : command !== null
                        ? <ShortcutKey command={command} />
                        : status === 'blur'
                            ? <em>Click to capture</em>
                            : <em>Capturing...</em>
                }
            </div>
            {keyString !== null || command !== defaultValue ? <UndoButton onClick={undo} /> : null}
            <small className="debug-vis-only"><pre>{JSON.stringify({ keyString, command, defaultValue }, null, 4)}</pre></small>
        </div>
    );
});

export default CaptureBox;
