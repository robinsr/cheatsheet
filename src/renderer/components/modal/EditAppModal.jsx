import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { HiOutlineTrash } from 'react-icons/hi';
import { useMst } from 'store';
import { Button, CursorFocusableInput } from 'components/inputs';
import Modal from './Modal';
import Dialog from 'components/modal/Dialog';
import KeyScope from 'components/providers/KeyScope';
import { getLogger } from 'utils';

const log = getLogger('JSX/EditAppModal');

const EditAppModal = observer(() => {
    let { apps } = useMst();

    const [ willDelete, setWillDelete ] = useState(false);

    function onClose() {
        apps.clearEditApp();
    }

    function deleteApp() {
        setWillDelete(false);
        log.error('Deleting app', apps.editApp.id);
        apps.removeApp(apps.editApp.id);
    }

    if (!apps.editApp) {
        return null;
    }

    let { name, windowName } = apps.editApp;

    return (
        <KeyScope scope={'EDIT_APP'}>
             <Modal
                type="small"
                name="edit-app-modal"
                title={'Edit ' + name}
                active={true}
                onClose={onClose}
                closeButton={false}
                content={
                     <div className="content">
                         <form onSubmit={e => e.preventDefault()} >
                             <div className="form-group">
                                 <label className="form-label">App name:</label>
                                 <CursorFocusableInput cursorName="edit-app-name"
                                     className="form-input"
                                     type="text"
                                     placeholder="Shortcut name"
                                     value={name}
                                     onChange={e => { apps.editApp.update({ name: e.target.value }) }}
                                     tabIndex="0"
                                 />
                             </div>
                             <div className="form-group">
                                 <label className="form-label">Window name:</label>
                                 <CursorFocusableInput cursorName="edit-app-window"
                                     className="form-input"
                                     type="text"
                                     placeholder="Shortcut name"
                                     value={windowName}
                                     onChange={e => { apps.editApp.update({ windowName: e.target.value }) }}
                                     tabIndex="0"
                                 />
                             </div>
                             {willDelete &&
                                <Dialog title={`Delete ${name}?`}
                                        onCancel={() => setWillDelete(false)}
                                        onConfirm={deleteApp}
                                />
                             }
                         </form>
                     </div>
                }
                footer={
                    <div>
                        <Button danger icon left onClick={() => setWillDelete(true)}>
                            <HiOutlineTrash/>
                        </Button>
                        <Button primary type="button" className="mx-1" onClick={onClose}>Done</Button>
                    </div>
                }/>
        </KeyScope>
    );
});

export default EditAppModal
