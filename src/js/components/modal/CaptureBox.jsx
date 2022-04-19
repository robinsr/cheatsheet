import React, { Component } from 'react';
import hotkeys from 'hotkeys-js';

import ShortcutKey from 'components/ShortcutKey';

const HK_SCOPE = 'new-shortcut';

const HOTKEYS_CONFIG = {
    scope: HK_SCOPE,
    keydown: true,
    keyup: true
}

const keyMap = {
    k32: 'SPACE',
    k65: 'A',
    k66: 'B',
    k67: 'C',
    k68: 'D',
    k69: 'E',
    k70: 'F',
    k71: 'G',
    k72: 'H',
    k73: 'I',
    k74: 'J',
    k75: 'K',
    k76: 'L',
    k77: 'M',
    k78: 'N',
    k79: 'O',
    k80: 'P',
    k81: 'Q',
    k82: 'R',
    k83: 'S',
    k84: 'T',
    k85: 'U',
    k86: 'V',
    k87: 'W',
    k88: 'X',
    k89: 'Y',
    k90: 'Z',
};

const handle_keydown = (e) => {
    const id = 'k' + e.keyCode;
    console.debug(`keydown:${keyMap[id]}, keycode:${e.keyCode}`);

    let kbString = '';
    let kbHtmlString = '';

    if (e.metaKey) {
        kbString += 'cmd-';
        kbHtmlString += '<kbd>⌘ Cmd</kbd>+';
    }

    if (e.ctrlKey) {
        kbString += 'ctrl-';
        kbHtmlString += '<kbd>Ctrl</kbd>+';
    }

    if(e.altKey){
        kbString += 'alt-';
        kbHtmlString += '<kbd>Alt</kbd>+';
    }

    if (e.shiftKey) {
        kbString += 'shift-';
        kbHtmlString += '<kbd>Shift</kbd>+';
    }


    if (e.key != 'Control' && e.key != 'Shift' && e.key != 'Alt' && e.key != 'Meta') {
        kbString += e.key;
        if (keyMap[id] != undefined) {
            kbHtmlString += '<kbd>' + keyMap[id] + '</kbd>';    
        } else {
            kbHtmlString += '<kbd>' + e.key + '</kbd>';
        }
    }

    return [ kbString, kbHtmlString ];
}

const oops_handler = (e) => {
    e.preventDefault();
    return event.returnValue = "Are you sure you want to exit?";
}

export default class CaptureBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 'blur',
            kb_string: null,
            kb_html_string: null
        }
    }

    start_capture = () => {
        console.log("Capturing");

        document.addEventListener("beforeunload", oops_handler, { capture: true });

        var kb_string = '';
        var kb_html_string = '';
        
        hotkeys('*', HOTKEYS_CONFIG, (e, handler) => {
            e.preventDefault();
            e.stopPropagation();

            let { type } = e;

            if (type == 'keydown') {

                if (e.keyCode == 9 || e.key == 'Tab') {
                    return this.handle_tab(e)
                }

                let result = handle_keydown(e);
                kb_string = result[0];
                kb_html_string = result[1];

            } else if (type == 'keyup') {
                if (e.keyCode == 9 || e.key == 'Tab') {
                    return;
                }

                this.setState({
                    kb_string, kb_html_string
                })
            }
            
        });

        hotkeys.setScope(HK_SCOPE);

        this.setState({ status: 'focus' });
    }

    stop_capture = (tab_out = false) => {
        console.log("End capturing");

        document.removeEventListener("beforeunload", oops_handler);

        hotkeys.deleteScope(HK_SCOPE);   

        this.setState({ status: 'blur' });

        this.props.onData({
            capture: this.state.kb_string, tab_out
        });
    }

    handle_tab = (e) => {
        this.stop_capture(true);
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