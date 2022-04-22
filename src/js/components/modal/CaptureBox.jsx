import React, { Component } from 'react';
import hotkeys from 'hotkeys-js';
import { get_kb_string, is_single_key, is_tab_key, oops_handler } from 'utils/dom';

import ShortcutKey from 'components/ShortcutKey';

const HK_SCOPE = 'new-shortcut';

const HOTKEYS_CONFIG = {
    scope: HK_SCOPE,
    keydown: true,
    keyup: true
}

const actions = {
    CAPTURE: 'CAPTURE',
    IGNORE: 'IGNORE',
    EXIT: 'EXIT',
    SAVE: 'SAVE'
}

const get_action = (e) => {
    if (e.type == 'keydown' && is_tab_key(e) && is_single_key(e)) {
        return actions.EXIT;
    }

    if (e.type == 'keyup' && is_tab_key(e) && is_single_key(e)) {
        return actions.IGNORE;
    }

    if (e.type == 'keydown') {
        return actions.CAPTURE;
    }

    if (e.type == 'keyup') {
        return actions.SAVE;
    }

    return actions.IGNORE;
}


export default class CaptureBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 'blur',
            kb_string: null
        }
    }

    start_capture = () => {
        console.debug("Capturing");

        document.addEventListener("beforeunload", oops_handler, { capture: true });

        let kb_string = '';
        
        hotkeys('*', HOTKEYS_CONFIG, (e, handler) => {
            e.preventDefault();
            e.stopPropagation();

            console.debug(e);

            switch (get_action(e)) {
                case actions.EXIT:
                    this.handle_tab(e);
                    break;
                case actions.CAPTURE:
                    kb_string = get_kb_string(e);
                    break;
                case actions.SAVE:
                    this.setState({ kb_string });
                    break;                
            }
        });

        hotkeys.setScope(HK_SCOPE);

        this.setState({ status: 'focus' });
    }

    stop_capture = (e, tab_out = false) => {
        console.debug("End capturing");

        document.removeEventListener("beforeunload", oops_handler);

        hotkeys.deleteScope(HK_SCOPE);   

        this.setState({ status: 'blur' });

        this.props.onData({
            capture: this.state.kb_string, tab_out
        });
    }

    handle_tab = (e) => {
        this.stop_capture(null, true);
    }

    render() {

        let { status, kb_string, kb_html_string } = this.state;
        let { defaultValue } = this.props;

        if (kb_string == null && defaultValue) {
            return (
                <div className="new-shortcut-box text-gray" tabIndex="0" 
                    onFocus={this.start_capture}
                    onBlur={this.stop_capture}>
                    <ShortcutKey command={defaultValue} />
                </div>
            )
        }

        return (
            <div className="new-shortcut-box text-gray" tabIndex="0" 
                onFocus={this.start_capture}
                onBlur={this.stop_capture}>
                {kb_string != null 
                    ? <ShortcutKey command={kb_string} />
                    : status == 'blur'
                        ? <em>Click to capture</em>
                        : <em>Capturing...</em>
                }
            </div>
        );
    }
}