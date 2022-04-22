import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'spectre-react'

import { useMst, Themes } from 'context/Store';


const OptionsForm = observer(() => {
    const { ui } = useMst();

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
                            checked={ui.theme == Themes.light}
                            onChange={ui.toggleTheme}
                        />
                        <i className="form-icon"></i> Light Keys
                    </label>
                    
                </li>
                <li className="menu-item">
                    <Button onClick={() => { console.log("TODO") }}>Export Markdown</Button> 
                </li>
            </ul>
        </div>
    );
});

export default OptionsForm;
