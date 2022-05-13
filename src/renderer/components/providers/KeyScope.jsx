import React, { useEffect } from 'react';
import { getLogger } from 'utils';
import { useKeys } from 'keys';

const log = getLogger('JSX/KeyScope');

/**
 * Wraps a component and sets the keyscope while the component is
 * mounted, returning scope to previous on un-mount. Useful for
 * modals. the hotkeys event filter for the scope shouldbe set
 * to return true for inputs in child elements
 */
const KeyScope = ({ scope='APP', prevScope='APP', children }) => {
    const keyEmitter = useKeys();

    useEffect(() => {
        log.info('Setting key scope:', scope);
        keyEmitter.setScope(scope, 'JSX/KeyScope::setup');

        return () => {
            log.info('Setting key scope:', prevScope);
            keyEmitter.setScope(prevScope, 'JSX/KeyScope::cleanup');
        }
    }, [])

    return children;
}

export default KeyScope;
