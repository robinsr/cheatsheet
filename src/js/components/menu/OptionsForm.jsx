import React from 'react';
import { Button } from 'spectre-react'

import { AppContext, Themes } from 'context/Store';


class OptionsForm extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
    }

    onChangeAction = (e) => {
        this.context.theme.toggleTheme();
    }

    onExportClick = (e) => {
        this.context.items.export();
    }

    render() {
        let vals = Themes.values;
        let theme = this.context.theme.theme

        return (
            <div className="dropdown">
                <Button className="dropdown-toggle" primary={true}>
                    <i className="icon icon-menu"></i>
                </Button>
                <ul className="menu">
                    <li className="menu-item">
                        <label className="form-switch">
                            <input
                                type="checkbox"
                                checked={theme == vals.light}
                                onChange={this.onChangeAction}
                            />
                            <i className="form-icon"></i> Light Keys
                        </label>
                        
                    </li>
                    <li className="menu-item">
                        <Button onClick={this.onExportClick}>Export Markdown</Button> 
                    </li>
                </ul>
            </div>
        );
    }
}

export default OptionsForm;
