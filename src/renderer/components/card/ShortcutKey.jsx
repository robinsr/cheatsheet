
import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { useMst, KeyThemes } from 'store';
import { PointerItem, Transition } from 'components/theme';
import { get_for_key } from 'utils/macos_symbols.js';

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

const Shortcut = styled.span`
  ${PointerItem()};
  ${Transition()};
  
  display: inline-block;
  border-radius: .1rem;
  line-height: 1.25;
  padding: .2rem .2rem;
  color: ${props => props.theme.keys.text};
  background-color: ${props => props.theme.keys.bg};
  white-space: nowrap;
  
  kbd {
    font-size: 0.85rem;
  }
`;

const ShortcutKey = observer(({ item, command, capture=false, splitKey='-', useRaw=false, onClick }) => {
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
            <Shortcut id={'kbd-'+command} ref={ref} onClick={onClick}>
                {command.split(splitKey)
                    .map(key => useRaw ? key : get_for_key(key))
                    .map(key => <kbd style={keyStyles[ui.keyTheme]} key={command + key}>{key}</kbd>)
                    .reduce((prev, curr) => [prev, ' + ', curr])
                }
            </Shortcut>
        </span>
    );
})

export default ShortcutKey;
