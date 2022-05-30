import { clone } from 'mobx-state-tree';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { HiOutlineTrash } from 'react-icons/hi';
import { useMst } from 'store';
import { Button, CursorFocusableInput } from 'components/inputs';
import { EDIT_APP } from 'utils/paths';
import useHistory from '../../hooks/useHistory';
import useParams from '../../hooks/useParams';
import Modal from './Modal';
import Dialog from 'components/modal/Dialog';
import KeyScope from 'components/providers/KeyScope';
import { getLogger } from 'utils';

const log = getLogger('JSX/EditAppModal');

const EditAppModal = observer(() => {
    let { apps } = useMst();

    const { back } = useHistory();
    const [ matches, { appIndex } ] = useParams(EDIT_APP);

    const [ willDelete, setWillDelete ] = useState(false);

    function deleteApp() {
        setWillDelete(false);
        log.error('Deleting app', apps.editApp.id);
        apps.removeApp(apps.editApp.id);
    }

    if (!matches) {
        return null;
    }

    let { name, windowName, update } = apps.at(appIndex);

    return (
        <KeyScope scope={'EDIT_APP'}>
             <Modal
                type="small"
                name="edit-app-modal"
                title={'Edit ' + name}
                active={true}
                onClose={back}
                closeButton={false}
                content={
                     <div className="content">
                         <div className="form-group">
                             <label className="form-label">App name:</label>
                             <CursorFocusableInput cursorName="edit-app-name"
                                 type="text"
                                 placeholder="Shortcut name"
                                 value={name}
                                 onChange={e => { update({ name: e.target.value }) }}
                                 tabIndex="0"
                             />
                         </div>
                         <div className="form-group">
                             <label className="form-label">Window name:</label>
                             <CursorFocusableInput cursorName="edit-app-window"
                                 type="text"
                                 placeholder="Shortcut name"
                                 value={windowName}
                                 onChange={e => { update({ windowName: e.target.value }) }}
                                 tabIndex="0"
                             />
                         </div>
                         {willDelete &&
                            <Dialog message={`Delete ${name}?`}
                                    onCancel={() => setWillDelete(false)}
                                    onConfirm={deleteApp}
                            />
                         }
                     </div>
                }
                footer={
                    <div>
                        <Button danger left svg onClick={() => setWillDelete(true)}>
                            <HiOutlineTrash/>
                        </Button>
                        <Button primary type="button" className="mx-1" onClick={back}>Done</Button>
                    </div>
                }/>
        </KeyScope>
    );
});

export default EditAppModal
