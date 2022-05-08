import React from 'react';
import { observer } from 'mobx-react-lite';
import { HiOutlineSave } from "react-icons/hi";
import { useMst, Themes } from 'store';

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
                        checked={ui.theme === Themes.light}
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
                <button className="btn btn-sm" onClick={onBackup}><HiOutlineSave /> Backup now</button>
            </div>
        </nav>
    );
});

export default OptionsForm;


