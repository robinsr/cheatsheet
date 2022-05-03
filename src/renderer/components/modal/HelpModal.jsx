import React from 'react';
import { observer } from 'mobx-react-lite';
import Modal from './Modal';
import { useMst } from 'store';
import { newUuid } from 'utils';
import { key_scopes, key_config } from 'utils/key_config';
import ShortcutKey from 'components/card/ShortcutKey';
import KeyScope from 'components/providers/KeyScope';

const installedScopes = [
    { scope: key_scopes.APP, title: 'General shortcuts' },
    { scope: key_scopes.EDIT_ITEM, title: 'In the edit item pane' }
];

const HelpTable = ({ scope, title }) => {
    return (
        <div className={'help-table'}>
            <h5>{title}</h5>
            <table className={'help-table-table table'}>
                <thead>
                <tr><th>Shortcut</th><th>Action</th></tr>
                </thead>
                <tbody>
                {scope.actions
                    .map(action => key_config[action])
                    .filter(({ key, help}) => help)
                    .map(({ key, help }) => {
                        return (
                            <tr key={newUuid()}>
                                <td>{key.split(',').map(keyItem => <ShortcutKey
                                    key={newUuid()}
                                    command={keyItem.trim()}
                                    capture={false}
                                    splitKey={'+'}
                                    useRaw={true}
                                />).reduce((p, c) => [p, ' or ', c])}</td>
                                <td>{help}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );
}


const HelpModal = observer(() => {
    const { cursor, setCursor } = useMst();

    if (cursor !== 'HELP') {
        return null;
    }

    return (
        <KeyScope scope={'HELP'} prevScope={'APP'}>
            <Modal
                type="medium"
                name="help-modal"
                title={'Help'}
                active={true}
                onClose={() => setCursor(null)}
                content={
                     <div className="content">
                        <div className="">
                            <div className="p-centered">
                                <h4>Keys</h4>
                                {installedScopes.map(i => <HelpTable
                                    key={newUuid()}
                                    scope={i.scope}
                                    title={i.title} />)}
                            </div>
                        </div>
                    </div>
                }/>
        </KeyScope>
    );
});

export default HelpModal