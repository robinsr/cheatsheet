import React, { Children } from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { isMatch } from 'matcher';

/**
 * Functions like a route, will render when cursor matches supplied pattern
 *
 * <Screen pattern="/things/*">
 *     <ComponentThatWillRenderSometimes/>
 * </Screen>
 */
const Screen = observer(({ pattern, patterns, children }) => {
    const { cursor } = useMst();

    if (pattern && patterns) {
        throw new Error('Both `pattern` and `patterns` props passed to Screen component');
    }

    if (pattern) {
        return isMatch(cursor, pattern.toString()) ? children : null;
    }

    if (patterns) {
        return isMatch(cursor , patterns.map(p => p.toString())) ? children : null;
    }
});

export default Screen
