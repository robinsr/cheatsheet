import React from 'react';
import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import { observer } from 'mobx-react-lite';
import { applyAction } from "mobx-state-tree";

import Logger from 'js-logger';


import { useMst } from 'context/Store';

const log = Logger.get('KeyActions');

const scopes = {
    APP: {
        scope: 'APP', keydown: true, keyup: false
    },
    SEARCH: {
        scope: 'SEARCH', keydown: false, keyup: true
    }
}

// Not sure if using event emitter is the best here, but it
// solves the issue of having a new callback every rerender
class KeyEmitter extends EventEmitter {
    constructor() {
        super();
        this.registerKeys();
    }

    onKey(cb) {
        this.removeAllListeners('key');
        this.on('key', cb);
    }

    setScope(scope) {
        log.debug('Setting scope', scope);
        hotkeys.setScope(scope);
    }

    registerKeys() {
        log.debug("Creating keys");

        hotkeys.filter = event => {
            // log.debug('hotkey target', event.target);
            let elemId = (event.target).id;
            if (elemId === 'app-search-input') {
                this.setScope('SEARCH');
                return true
            }

            if (elemId === 'capture-box') {
                this.setScope('capture-box');
                return true;
            }

            if (elemId === 'capture-box') {
                this.setScope('capture-box');
                return true;
            }

            let tagName = event.target.tagName;
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(tagName)) {
                return false;
            }

            this.setScope('APP');
            return true;
        }

        hotkeys('S,/', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'FOCUS_SEARCH');
            this.emit('key', [ 'setCursor', '', ['SEARCH'] ]);
        })

        hotkeys('F', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'ADD_TO_FAV');
            this.emit('key', undefined,'ADD_TO_FAV');
        })

        hotkeys('E, enter', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'EDIT_ITEM');
            this.emit('key', ['setEditItem', '/edit']);
        })

        hotkeys('command + n', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'NEW_SHORTCUT');
            this.emit('key', [ 'addItem', '/apps', (root) => {
                return [ root.cursor ]
            } ]);
        })

        hotkeys('n', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'NEW_CATEGORY');
            this.emit('key', [ 'addItem', '/apps', (root) => {
                return [ root.cursor ]
            } ]);
        })

        hotkeys('/', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'FOCUS_SEARCH + START_COMMAND');
            this.emit('key', undefined,'FOCUS_SEARCH + START_COMMAND');
        })



        hotkeys('esc', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'ESCAPE');
            this.emit('key', [ 'clearEditItem', '/edit' ]);
        })

        hotkeys('shift+/,?', scopes.APP, (e, h) => {
            log.debug('Trigger Action', 'SHOW_HELP_MODAL');
            this.emit('key', ['setCursor', '', [ 'HELP' ] ]);
        })

        hotkeys('up, down', scopes.APP, (e, h) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');
            log.debug('Trigger Action', 'MOVE_SELECTION_' + direction);

            if (direction === 'DOWN') {
                this.emit('key', ['cursorDown', '', [] ]);
            } else if (direction === 'UP') {
                this.emit('key', ['cursorUp', '', [] ]);
            }
        });

        hotkeys('right, left', scopes.APP, (e, h) => {
            let direction = ( e.key === 'ArrowRight' ? 'NEXT' : 'PREV');
            log.debug('Trigger Action', 'CHANGE_APP_' + direction);

            if (direction === 'NEXT') {
                 this.emit('key', ['nextApp', '/apps', [] ]);
                 this.emit('key', ['setCursor', '', (root) => [ root.apps.topItem.id ] ]);
            } else if (direction === 'PREV') {
                 this.emit('key', ['prevApp', '/apps', [] ])
                 this.emit('key', ['setCursor', '', (root) => [ root.apps.topItem.id ] ]);
            }
        })

        // hotkeys('enter', scopes.APP, (e, h) => {
        //     log.debug('Trigger Action', 'ENTER');
        //     this.emit('key', [ 'setEditItem','ENTER');
        // });

        hotkeys('up,down', scopes.SEARCH, (e, h) => {
            let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');
            log.debug('Trigger Action', 'MOVE_SEARCH_SELECTION_' + direction);
            this.emit('key', undefined,'MOVE_SEARCH_SELECTION_' + direction);
        });

        this.setScope('APP');
    }
}


const keys = new KeyEmitter();

const KeyActions = observer(({ children }) => {

    let root = useMst();
    let { cursor } = root;

    keys.onKey(action => {
        if (!action) {
            return; // These actions are TODOs
        }

        let [ name, path, args ] = action;

        if (typeof args === 'function') {
            args = args(root);
        }

        // apply current cursor value as default arg
        if (!args) {
            args = [ cursor ];
        }

        let actionObj = { name, path, args };

        log.debug('Applying action', actionObj)

        applyAction(root, actionObj);
    });

    return (
        <div>
            {children}
        </div>

    );
});

export default KeyActions;
