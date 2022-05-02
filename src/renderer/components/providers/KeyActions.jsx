import React from 'react';
import { observer } from 'mobx-react-lite';
import { applyAction } from 'mobx-state-tree';
import { KeyEmitter, key_scopes, getLogger } from 'utils';
import { useMst } from 'store';

const log = getLogger('KeyActions');

/**
 * Setup keys emitter and install scopes as needed
 */
const keys = new KeyEmitter([
    key_scopes.APP, key_scopes.CAPTURE, key_scopes.EDIT_ITEM
], 'APP');

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

    return children;
});

export default KeyActions;
