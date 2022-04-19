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

        this.ref = createRef();

        this.state = {
            image_data: null
        }

        this.props.item.attach_ref(this.ref);
    }

    generate_png = () => {
        if (this.state.image_data) {
            return;
        }

        this.props.item.fetch_image_data().then(image_data => {
            this.setState({ image_data })
        });
    }

    render_key = (key) => {
        let { command } = this.props;
        let { theme } = this.context.theme;

        let symbol = symbols_dict[key] ? symbols_dict[key].symbol : key;

        return (
            <kbd style={keyStyles[theme]} key={command + key}>{symbol}</kbd>
        );
    }

    render_image = () => {
        let { data_url, width, height } = this.state.image_data;

        return (
            <img src={'' + data_url} width={width} height={height} />
        );
    }


	render() {
		let { command } = this.props;

        let { image_data } = this.state;

        return(
            <div className="popover popover-right" onMouseEnter={this.generate_png}>
                <span id={'kbd-' + command} className="label shortcut" ref={this.ref}>
                    {command.split('-')
                        .map(this.render_key)
                        .reduce((prev, curr) => [prev, ' + ', curr])
                    }
                </span>
                <div className="popover-container">
                    <div className="card">
                        <div className="card-body p-centered">
                        {image_data != null
                            ? this.render_image()
                            : <span className="">
                                Getting that image for you...
                                <div className="loading loading-lg"></div>
                                </span>
                        }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShortcutKey;
