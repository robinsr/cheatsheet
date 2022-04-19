import React from 'react';

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

        debugger;

        return (
            <div>
                <div className="form-group form-inline">
                    <label className="form-switch">
                        <input
                            type="checkbox"
                            checked={theme == vals.light}
                            onChange={this.onChangeAction}
                        />
                        <i className="form-icon"></i> Light Keys
                    </label>
                </div>
                <div className="form-group form-inline">
                    <button className="btn btn-sm" onClick={this.onExportClick}>Export Markdown</button>
                </div>
            </div>
        );
    }
}

export default OptionsForm;
