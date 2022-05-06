import React from 'react';
import { observer } from 'mobx-react-lite';
import { KeyEmitter, getLogger } from 'utils';
import { useMst } from 'store';

const log = getLogger('KeyActions');

const KeyActions = observer(({ children }) => {

    let root = useMst();

    KeyEmitter.onScope(scope => {
        root.state.setKeyScope(scope);
    });

    KeyEmitter.onKey(({ event, actionName, run }) => {
        log.debug('Running action: ', actionName);
        run(event, root);
    });

    return children;
});

export default KeyActions;
