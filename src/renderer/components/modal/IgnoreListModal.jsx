import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';

import KeyScope from 'components/providers/KeyScope';
import { Button } from 'components/inputs';
import Modal from 'components/modal/Modal';
import { TableContainer, TableHeaderRow, TableRow } from 'components/theme/elements/Table';
import { FlexItem } from 'components/theme';

import { IGNORE_APPS } from 'utils/paths';
import useHistory from '../../hooks/useHistory';
import useParams from '../../hooks/useParams';


const IgnoreListModal = observer(() => {
    let { settings } = useMst();
    let { back } = useHistory();
    let [ matches ] = useParams(IGNORE_APPS);

    const removeItem = (app) => (e) => {
        e.preventDefault();
        settings.removeIgnoreApp(app);
    }

    if (!matches) {
        return null;
    }

    return (
        <KeyScope scope={'MODAL'} prevScope={'APP'}>
            <Modal
                active={true}
                name={'ignore-list-modal'}
                title={'Ignoring Apps'}
                type={'small'}
                onClose={() => back()}
                content={
                    <div className="modal-content" style={{ height: '10rem' }}>
                        <TableContainer>
                            <TableHeaderRow>
                                <FlexItem>App Name</FlexItem>
                                <FlexItem>Remove</FlexItem>
                            </TableHeaderRow>
                            {settings.ignoreApps.map(app => (
                                <TableRow key={'ignore-app-' + app}>
                                    <FlexItem>{app}</FlexItem>
                                    <FlexItem>
                                        <Button small danger icon={'delete'} onClick={removeItem(app)}/>
                                    </FlexItem>
                                </TableRow>
                            ))}
                        </TableContainer>
                    </div>
                }
            />
        </KeyScope>
    )
});

export default IgnoreListModal;
