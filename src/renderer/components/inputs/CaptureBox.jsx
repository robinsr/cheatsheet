import './CaptureBox.scss';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react-lite";
import { useMst } from "context/Store.jsx";
import Logger from 'js-logger';
import hotkeys from 'hotkeys-js';
import { key_scopes } from 'utils/key_config';
import {
    captureActions,
    getCaptureAction,
    getKeyString, isTabKey
} from 'utils/dom';
import ShortcutKey from 'components/card/ShortcutKey.jsx';
import classnames from "classnames";
import { FaUndo } from "react-icons/all";

const log = Logger.get('JSX/CaptureBox');
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

        if (hotkeys.getScope() === hotkeysConfig.scope) {
            log.warn('Already capturing, returning');
            return;
        }
        
        hotkeys('*', hotkeysConfig, (e) => {

            log.debug('Found event:', getKeyString(e))

            switch (getCaptureAction(e)) {
                case captureActions.EXIT:
                    //handleTabEvent(e); // let the tab event bubble up (causing a onBlur?)
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

        setStatus('focus');
    }

    const stopCapture = (e, tab_out=false, discard=false) => {
        log.debug("End capturing", {
            status, keyString, defaultValue
        });
        hotkeys.deleteScope(hotkeysConfig.scope);

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
