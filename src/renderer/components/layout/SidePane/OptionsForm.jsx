import React from 'react';
import { Button } from 'components/inputs';
import { observer } from 'mobx-react-lite';
import { GiMoonBats } from 'react-icons/gi';
import { HiOutlineSave } from "react-icons/hi";
import { Toggle } from 'components/inputs';
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
            <Toggle checked={ui.useSystemTheme}
                    onChange={checked => {
                        ui.toggleSystemTheme();
                        // closeContainer();
                    }}
                    label={'OS default'}/>
            <Toggle checked={ui.userPrefersNight}
                    disabled={ui.useSystemTheme}
                    onChange={checked => {
                        checked ? ui.setUserTheme('night') : ui.setUserTheme('day');
                        // closeContainer();
                    }}
                    label={<GiMoonBats/>}/>
            <Toggle checked={ui.keyTheme === KeyThemes.light}
                    onChange={e => {
                        ui.toggleKeyTheme();
                        closeContainer();
                    }}
                    label={'Light Keys'}/>
            <Toggle checked={ui.activeFollow}
                    onChange={ui.toggleActiveFollow}
                    label={'Active follow'}/>
            <Toggle checked={ui.alwaysOnTop}
                    onChange={ui.toggleAlwaysOnTop}
                    label={'Keep window on top'}/>
            <div className="form-control my-2">
                <Button small onClick={onBackup}><HiOutlineSave /> Backup now</Button>
            </div>
        </nav>
    );
});

export default OptionsForm;


