import React from 'react';
import { Button, ButtonLink } from 'components/inputs';
import { observer } from 'mobx-react-lite';
import { GiMoonBats } from 'react-icons/gi';
import { HiOutlineSave } from "react-icons/hi";
import { Toggle } from 'components/inputs';
import { useMst } from 'store';

const OptionsForm = observer(() => {
    const { settings, backup } = useMst();

    function onBackup() {
        let data = JSON.stringify(backup());

        navigator.clipboard.writeText(data)
            .then(() => console.log('copied'))
            .catch(console.error);
    }

    return (
        <nav className="nav-group">
            <h5 className="nav-group-title">Options</h5>
            <Toggle checked={settings.useSystemTheme}
                    onChange={checked => {
                        settings.toggleSystemTheme();
                        // closeContainer();
                    }}
                    label={'OS default'}/>
            <Toggle checked={settings.userPrefersNight}
                    disabled={settings.useSystemTheme}
                    onChange={checked => {
                        checked ? settings.setUserTheme('night') : settings.setUserTheme('day');
                        // closeContainer();
                    }}
                    label={<GiMoonBats/>}/>
            <Toggle checked={settings.keyTheme === 'light'}
                    onChange={e => {
                        settings.toggleKeyTheme();
                        // closeContainer();
                    }}
                    label={'Light Keys'}/>
            <Toggle checked={settings.activeFollow}
                    onChange={settings.toggleActiveFollow}
                    label={'Active follow'}/>
            <Toggle checked={settings.alwaysOnTop}
                    onChange={settings.toggleAlwaysOnTop}
                    label={'Keep window on top'}/>
            <div className="form-control my-2">
                <ButtonLink onClick={onBackup}><HiOutlineSave /> Backup now</ButtonLink>
            </div>
        </nav>
    );
});

export default OptionsForm;


