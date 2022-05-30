import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Provider } from '../../keys';
import { key_scopes } from '../../keys/key_config';
import KeyEmitter from '../../keys/key_emitter';
import { useMst } from 'store';
import { getLogger } from 'utils';

const log = getLogger('KeyProvider');


const KeyProvider = observer(({ children }) => {
    let root = useMst();

    const keyEmitter = useMemo(() => {
        return new KeyEmitter([
            key_scopes.APP,
            key_scopes.MODAL,
            key_scopes.SEARCH,
            key_scopes.CAPTURE,
            key_scopes.EDIT_ITEM,
            key_scopes.EDIT_APP,
            key_scopes.NEW_APP
        ], 'APP');
    }, []);

    keyEmitter.onScope(scope => {
        root.state.setKeyScope(scope);
    });

    keyEmitter.onKey(({ event, actionName, run }) => {
        log.debug('Running action: ', actionName);
        run(event, root);
    });

    return (
        <Provider value={keyEmitter}>{children}</Provider>
    );
});

export default KeyProvider;
