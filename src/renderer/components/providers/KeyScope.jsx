import React, { useEffect } from 'react';
import { getLogger } from 'utils';
import { useKeys } from 'keys';
import { noop } from 'lodash';

const log = getLogger('JSX/KeyScope');

/**
 * Wraps a component and sets the keyscope while the component is
 * mounted, returning scope to previous on un-mount. Useful for
 * modals. the hotkeys event filter for the scope should be set
 * to return true for inputs in child elements
 */
const KeyScope = ({ scope='APP', prevScope='APP', onAction=noop, children }) => {
    const keyEmitter = useKeys();

    useEffect(() => {
        // set scope on mount
        log.info('Setting key scope:', scope);
        keyEmitter.setScope(scope, 'JSX/KeyScope::setup');

        const handleKeys = evt => onAction(evt);

        // send key events to function prop
        keyEmitter.on('keys', handleKeys);

        // Set scope on unMount
        return () => {
            keyEmitter.off('keys', handleKeys);
            log.info('Setting key scope:', prevScope);
            keyEmitter.setScope(prevScope, 'JSX/KeyScope::cleanup');
        }
    }, [])

    return children;
}

export default KeyScope;
