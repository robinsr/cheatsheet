
import React, { useEffect, useRef, useState } from 'react';
import hotkeys from 'hotkeys-js';
import { observer } from "mobx-react-lite";
import { isEmpty as _isEmpty } from 'lodash';
import classnames from "classnames";
import { useMst } from "store";
import { MobxShortcut, SEPARATOR } from 'store/types/Shortcut';
import {
    captureActions,
    getCaptureAction,
    getKeyString,
    getLogger,
    isTabKey
} from 'utils';

import { useKeys } from 'keys';
import { key_scopes } from 'keys/key_config';

import { Debugger } from 'components/dev/Debug';
import ShortcutKey from 'components/card/ShortcutKey';
import StyledCaptureBox from 'components/inputs/keycapture/StyledCaptureBox';
import UndoButton from './UndoButton';

const log = getLogger('JSX/CaptureBox');
const hotkeysConfig = key_scopes.CAPTURE.config;


const CaptureBox = observer(({
    defaultValue, command, cursorName, tabNext, onData
}) => {
    let keyEmitter = useKeys();
    let { cursor, setCursor } = useMst();
    let ref = useRef();

    let [ status, setStatus ] = useState('blur');
    let [ keyString, setKeyString ] = useState(null);

    useEffect(() => {
        if (cursor && cursor.endsWith(cursorName)){
            log.debug('Focusing:', cursorName);
            ref.current?.focus();
        }
    }, [ cursor ]);

    const onClick = (e) => {
        if (cursorName && cursor !== cursorName) {
            setCursor(cursorName);
        }
    }

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

        keyEmitter.setScope('CAPTURE', 'JSX/CaptureBox');
        setStatus('focus');
    }

    const stopCapture = (e, tab_out=false, discard=false) => {
        log.debug("End capturing", {
            status, keyString, defaultValue
        });
        hotkeys.unbind('*' ,'CAPTURE');
        // hotkeys.deleteScope('CAPTURE')
        keyEmitter.setScope('EDIT_ITEM', 'JSX/CaptureBox');

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

    let cns = classnames('new-shortcut-box', 'text-gray', {
        'focus': status === 'focus'
    });

    /**
     * Order precedence:
     * keyString (unsaved input) > command (saved to edit model) > defaultValue (saved to model)
     */
    return (
        <div style={{position: "relative"}} onBlur={stopCapture} onClick={onClick}>
            <StyledCaptureBox className={cns}
                 tabIndex="0"
                 id="capture-box"
                 ref={ref}
                 onFocus={startCapture}>
                {keyString !== null
                    ? <ShortcutKey command={MobxShortcut.create(keyString.join(SEPARATOR))} />
                    : !_isEmpty(command)
                        ? <ShortcutKey command={command} />
                        : status === 'blur'
                            ? <em>Click to capture</em>
                            : <em>Capturing...</em>
                }
            </StyledCaptureBox>
            {keyString !== null || command !== defaultValue ? <UndoButton onClick={undo} /> : null}
            <Debugger obj={{ keyString, command, defaultValue }}/>
        </div>
    );
});

export default CaptureBox;
