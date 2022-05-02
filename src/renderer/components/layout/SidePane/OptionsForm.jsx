import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'spectre-react'
import { HiOutlineSave } from "react-icons/all";
import { useMst, Themes } from 'context/Store';

const OptionsForm = observer(() => {
    const { ui, backup } = useMst();

    function onBackup() {
        let data = JSON.stringify(backup());

        navigator.clipboard.writeText(data)
            .then(() => console.log('copied'))
            .catch(console.error);
    }

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
            <div className="form-control">
                <label className="form-switch">
                    <input
                        type="checkbox"
                        checked={ui.activeFollow}
                        onChange={ui.toggleActiveFollow}
                    />
                    <i className="form-icon"></i> Active follow
                </label>
            </div>

            <div className="form-control my-2">
                <Button small={true} onClick={onBackup}><HiOutlineSave /> Backup now</Button>
            </div>
        </nav>
    );
});

export default OptionsForm;


