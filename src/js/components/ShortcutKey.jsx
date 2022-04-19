import React, { Component, createRef } from 'react';

import { AppContext, Themes } from 'context/Store';
import { macos_symbols as symbols_dict } from 'utils/macos_symbols';

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

class ShortcutKey extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
    }

    render_key = (key) => {
        let { command } = this.props;
        let { theme } = this.context.theme;

        let symbol = symbols_dict[key] ? symbols_dict[key].symbol : key;

        return (
            <kbd style={keyStyles[theme]} key={command + key}>{symbol}</kbd>
        );
    }


	render() {
		let { command } = this.props;

        return(
            <div className="popover popover-right">
                <span id={'kbd-' + command} className="label shortcut">
                    {command.split('-')
                        .map(this.render_key)
                        .reduce((prev, curr) => [prev, ' + ', curr])
                    }
                </span>
            </div>
        );
    }
}

export default ShortcutKey;
