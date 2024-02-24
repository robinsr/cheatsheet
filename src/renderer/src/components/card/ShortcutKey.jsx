import { isEmpty } from 'lodash';
import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { useMst } from 'store';
import { PointerItem, Transition } from 'components/theme';

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

const ShortcutKey = observer(({
    item,
    command,
    capture=false,
    useRaw=false,
    onClick
}) => {
    let { settings } = useMst();

    let ref = useRef(null);

    if (capture) {
        item.setRef(ref);
    }

    if (!command || isEmpty(command.keys)) {
        return null;
    }

    const kbds = command.keys
        .map(key => useRaw ? key.name : key.symbol)
        .map(key => <kbd style={keyStyles[settings.keyTheme]} key={command.id + key}>{key}</kbd>)
        .reduce((prev, curr) => [prev, ' + ', curr])

    return(
        <span>
            <Shortcut id={'kbd-'+command} ref={ref} onClick={onClick}>{kbds}</Shortcut>
        </span>
    );
})

export default ShortcutKey;
