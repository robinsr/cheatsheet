import React from 'react';
import { observer } from 'mobx-react-lite';
import { applyAction } from 'mobx-state-tree';
import { isArray as _isArray } from 'lodash';
import { KeyEmitter, getLogger } from 'utils';
import { useMst } from 'store';

const log = getLogger('KeyActions');


const runAction = (root, action) => {
    let [ name, path, args ] = action.args;

    if (action.hasPathSupplier) {
        path = path(root);
        if (!path) return false;
    }

    if (action.hasArgSupplier) {
        args = args(root);
        if (args === false) return false;
    }

    // apply current cursor value as default arg
    if (!args) {
        args = [ root.cursor ];
    }

    let actionObj = { name, path, args };
    log.debug('Applying action', actionObj);
    applyAction(root, actionObj);
}

const KeyActions = observer(({ children }) => {

    let root = useMst();

    KeyEmitter.onScope(scope => {
        root.setKeyScope(scope);
    });

    KeyEmitter.onKey(action => {
        if (!action) {
            return; // These actions are TODOs
        }

        if (_isArray(action)) {
            for (let i = 0; i < action.length; i++) {
                log.debug('Running action:', action[i]);
                if (runAction(root, action[i]) === false) {
                    log.debug('Cancelling remaining actions');
                    break;
                }
            }
        } else {
            // handle single
            runAction(root, action);
        }
    });

    return children;
});

export default KeyActions;
