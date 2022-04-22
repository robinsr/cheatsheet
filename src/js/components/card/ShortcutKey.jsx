import React, { Component, createRef } from 'react';

import { AppContext, Themes } from 'context/Store';
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

class ShortcutKey extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.ref = createRef();

        if (this.props.item && this.props.item.attach_ref) {
            this.props.item.attach_ref(this.ref);
        }
    }

    render_key = (key) => {
        let { command } = this.props;
        let { theme } = this.context.theme;
        let symbol = get_for_key(key);

        return (
            <kbd style={keyStyles[theme]} key={command + key}>{symbol}</kbd>
        );
    }


	render() {
		let { command } = this.props;

        if (!command) {
            return null;
        }

        return(
            <div>
                <span id={'kbd-' + command} className="label shortcut" ref={this.ref}>
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
