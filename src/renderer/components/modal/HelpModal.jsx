import React from 'react';
import { observer } from 'mobx-react-lite';
import { MobxShortcut } from 'store/types/Shortcut';
import styled from 'styled-components';
import { HELP, HOME } from 'utils/paths';
import useHistory from '../../hooks/useHistory';
import useParams from '../../hooks/useParams';
import Modal from './Modal';
import { useMst } from 'store';
import { newUuid } from 'utils';
import { key_scopes, key_config } from 'keys/key_config';
import ShortcutKey from 'components/card/ShortcutKey';
import KeyScope from 'components/providers/KeyScope';

const installedScopes = [
    { scope: key_scopes.APP, title: 'General shortcuts' },
    { scope: key_scopes.EDIT_ITEM, title: 'While editing an item' }
];

const StyledTable = styled.table`
  th, td {
    padding: 0.3rem 0;
  }
`;

const HelpTable = ({ scope, title }) => {
    return (
        <div className={'help-table'}>
            <h5>{title}</h5>
            <StyledTable className={'table'}>
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
                                    command={MobxShortcut.create(keyItem.trim())}
                                    capture={false}
                                    useRaw={false}
                                />).reduce((p, c) => [p, ' or ', c])}</td>
                                <td>{help}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </StyledTable>
        </div>
    );
}


const HelpModal = observer(() => {
    const { back } = useHistory();
    const [ isMatch ] = useParams(HELP);

    if (!isMatch) {
        return null;
    }

    return (
        <KeyScope scope={'MODAL'} prevScope={'APP'}>
            <Modal
                type="regular"
                name="help-modal"
                title={'Shortcut keys'}
                active={true}
                onClose={() => back()}
                content={
                     <div className="content">
                        <div className="">
                            <div className="p-centered">
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