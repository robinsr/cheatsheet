import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { useMst, Themes } from 'context/Store';
import { get_for_key } from 'utils/macos_symbols';

const keyStyles = {
    light: {
        backgroundColor: '#fff',
        color: '#303742'
    },
    dark: {
        backgroundColor: '#303742',
        color: '#fff'
    }
};

const ShortcutKey = observer(({ item, command, capture=false }) => {
    let { ui } = useMst();

    let ref = useRef(null);

    if (capture) {
        item.setRef(ref);
    }

    if (!command) {
        return null;
    }

    return(
        <span>
            <span id={'kbd-' + command} className="label shortcut" ref={ref}>
                {command.split('-')
                    .map(key => <kbd style={keyStyles[ui.theme]} key={command + key}>{get_for_key(key)}</kbd>)
                    .reduce((prev, curr) => [prev, ' + ', curr])
                }
            </span>
        </span>
    );
})

export default ShortcutKey;
