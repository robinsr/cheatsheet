import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, FormGroup, Input } from 'spectre-react';

import Modal from 'components/modal/Modal';
import CaptureBox from 'components/modal/CaptureBox';
import { useMst } from 'context/Store';

const HELP_MSG = 'Not all keyboard shortcuts can be captured.\nExamples include:\n- Cmd-W (close window)\n- Cmd-Q (quit)';

const EditModal = observer(() => {
    let { items } = useMst();

    let itemGroups = items.itemGroups;
    let editItem = items.editItem;

    let saveRef = useRef();

    function save () {
        items.saveEditItem();
    }

    function close () {
        items.clearEditItem();
    }

    function onCapture (data) {
        editItem.update('command', data.capture);

        if (data.tab_out) {
            saveRef.current.focus();
        }
    }

    if (editItem) {

        let { label, category, command } = editItem;


        return (
            <Modal 
                type={'modal-sm'}
                name={'new-shortcut-modal'}
                title={'Add/Edit Shortcut'}
                active={true}
                onClose={close}
                content={
                    <div className="content">
                        <form>
                            <FormGroup>
                                <label className="form-label">Shortcut name:</label>
                                <input className="form-input" 
                                    name="label"
                                    type="text"
                                    placeholder="Shortcut name"
                                    value={label}
                                    onChange={e => { editItem.update('label', e.target.value) }}
                                    tabIndex="0"
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-label">Group:</label>
                                <select className="form-select"
                                    name="category"
                                    value={category}
                                    onChange={e => { editItem.update('category', e.target.value) }}
                                    tabIndex="0">
                                        {itemGroups.map(i => (
                                            <option value={i} key={i}>{i}</option>
                                        ))}
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label className="form-label tooltip" data-tooltip={HELP_MSG}>Keys:</label>
                                <input type="hidden" name="cmd" value={command} />
                                <CaptureBox defaultValue={command} onData={onCapture} />
                            </FormGroup>
                        </form>
                    </div>
                }
                footer={
                    <button type="button" className="btn btn-primary mx-1" onClick={save} ref={saveRef}>Save</button> 
                }
            />
        );
    }

    return null;
});

export default EditModal;
