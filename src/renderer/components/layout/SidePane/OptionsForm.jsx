import React from 'react';
import { Button } from 'components/inputs';
import { observer } from 'mobx-react-lite';
import { GiMoonBats } from 'react-icons/gi';
import { HiOutlineSave } from "react-icons/hi";
import { useMst, KeyThemes } from 'store';

const OptionsForm = observer(({ closeContainer }) => {
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
                        checked={ui.isDarkMode}
                        onChange={e => {
                            e.target.checked ? ui.night() : ui.day();
                            closeContainer();
                        }}
                    />
                    <i className="form-icon"></i> <GiMoonBats/>
                </label>
            </div>
            <div className="form-control">
                <label className="form-switch">
                    <input
                        type="checkbox"
                        checked={ui.keyTheme === KeyThemes.light}
                        onChange={e => {
                            ui.toggleKeyTheme();
                            closeContainer();
                        }}
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
                <Button small onClick={onBackup}><HiOutlineSave /> Backup now</Button>
            </div>
        </nav>
    );
});

export default OptionsForm;


