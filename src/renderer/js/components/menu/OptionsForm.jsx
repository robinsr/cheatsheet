import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'spectre-react'

import { useMst, Themes } from 'context/Store.jsx';


const OptionsForm = observer(() => {
    const { ui } = useMst();

    return (
        <nav className="nav-group">
            <h5 className="nav-group-title">Options</h5>
            <div className="form-control">
                <label className="form-switch">
                    <input
                        type="checkbox"
                        checked={ui.theme == Themes.light}
                        onChange={ui.toggleTheme}
                    />
                    <i className="form-icon"></i> Light Keys
                </label>
            </div>
        </nav>
    );
});

export default OptionsForm;


