import React from 'react';
import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import { observer } from 'mobx-react-lite';
import { applyAction } from "mobx-state-tree";

import { getDebugLogger } from 'utils/logger';
import { useMst } from 'context/Store';

const logger = getDebugLogger('KeyActions');

const scopes = {
    APP: {
        scope: 'APP', keydown: false, keyup: true
    },
    SEARCH: {
        scope: 'SEARCH', keydown: false, keyup: true
    }
}

const Keys = function (cb) {
    logger("Creating keys");

    hotkeys.filter = function(event) {
        // logger('hotkey target', event.target);
        function setScope() {
            let elemId = (event.target).id;
            if (elemId === 'app-search-input') {
                hotkeys.setScope('SEARCH');
                return true
            }

            if (elemId === 'capture-box') {
                hotkeys.setScope('capture-box');
                return true;
            }

            if (elemId === 'capture-box') {
                hotkeys.setScope('capture-box');
                return true;
            }

            let tagName = event.target.tagName;
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(tagName)) {
                return false;
            }

            hotkeys.setScope('APP');
            return true;
        }

        const val = setScope();
        // logger('Current scope', hotkeys.getScope());
        return val;
    }

    hotkeys('S', scopes.APP, (e, h) => {
        logger('Trigger Action', 'FOCUS_SEARCH');
        cb([ 'setCursor', '', ['SEARCH'] ]);
    })

    hotkeys('F', scopes.APP, (e, h) => {
        logger('Trigger Action', 'ADD_TO_FAV');
        cb(undefined,'ADD_TO_FAV');
    })

    hotkeys('E', scopes.APP, (e, h) => {
        logger('Trigger Action', 'EDIT_ITEM');
        cb(['setEditItem', '/items']);
    })

    hotkeys('N', scopes.APP, (e, h) => {
        logger('Trigger Action', 'NEW_SHORTCUT');
        cb([ 'addItem', '/items', (root) => {
            return [ root.apps.selectedApp, root.apps.selectedApp.categories[0] ]
        } ]);
    })

    hotkeys('/', scopes.APP, (e, h) => {
        logger('Trigger Action', 'FOCUS_SEARCH + START_COMMAND');
        cb(undefined,'FOCUS_SEARCH + START_COMMAND');
    })

    hotkeys('esc', scopes.APP, (e, h) => {
        logger('Trigger Action', 'ESCAPE');
        cb([ 'clearEditItem', '/items' ]);
    })

    hotkeys('shift+/', scopes.APP, (e, h) => {
        logger('Trigger Action', 'SHOW_HELP_MODAL');
        cb(undefined, ['SHOW_HELP_MODAL', '', [] ]);
    })

    hotkeys('up,down', scopes.APP, (e, h) => {
        let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');
        logger('Trigger Action', 'MOVE_SELECTION_' + direction);
        cb(undefined,'MOVE_SELECTION_' + direction);
    });

    hotkeys('up,down', scopes.SEARCH, (e, h) => {
        let direction = ( e.key === 'ArrowUp' ? 'UP' : 'DOWN');
        logger('Trigger Action', 'MOVE_SEARCH_SELECTION_' + direction);
        cb(undefined,'MOVE_SEARCH_SELECTION_' + direction);
    });

    hotkeys.setScope('APP');
};

// Not sure if using event emitter is the best here, but it
// solves the issue of having a new callback every rerender
class MyEmitter extends EventEmitter {
    constructor() {
        super();

        Keys(action => {
            this.emit('event', action);
        });
    }
}

const myEmitter = new MyEmitter();

const KeyActions = observer(({ children }) => {

    let root = useMst();
    let { cursor } = root;

    myEmitter.removeAllListeners('event');
    myEmitter.on('event', action => {
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

        logger('Applying action', actionObj)

        applyAction(root, actionObj);
    });

    return (
        <div>
            {children}
        </div>

    );
});

export default KeyActions;
