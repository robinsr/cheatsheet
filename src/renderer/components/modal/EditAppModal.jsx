import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { FormGroup } from 'spectre-react';
import { CursorFocusableInput } from 'components/inputs';
import Modal from './Modal';

const EditAppModal = observer(() => {
    let { apps } = useMst();

    function onClose() {
        apps.clearEditApp();
    }

    if (!apps.editApp) {
        return null;
    }

    let { name, windowName } = apps.editApp;

    return (
        <Modal
            type="small"
            name="edit-app-modal"
            title={'Edit ' + name}
            active={true}
            onClose={onClose}
            content={
                 <div className="content">
                     <form>
                         <FormGroup>
                             <label className="form-label">App name:</label>
                             <CursorFocusableInput cursorName="edit-form-label"
                                 className="form-input"
                                 type="text"
                                 placeholder="Shortcut name"
                                 value={name}
                                 onChange={e => { apps.editApp.update({ name: e.target.value }) }}
                                 tabIndex="0"
                             />
                         </FormGroup>
                         <FormGroup>
                             <label className="form-label">Window name:</label>
                             <input className="form-input"
                                 type="text"
                                 placeholder="Shortcut name"
                                 value={windowName}
                                 onChange={e => { apps.editApp.update({ windowName: e.target.value }) }}
                                 tabIndex="0"
                             />
                         </FormGroup>
                     </form>
                 </div>
            }
            footer={
                <button type="button" className="btn btn-primary mx-1" onClick={onClose}>Done</button>
            }/>
    );
});

export default EditAppModal
