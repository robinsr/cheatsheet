import KeyScope from 'components/providers/KeyScope';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormGroup } from 'spectre-react';
import Modal from './Modal.jsx';
import { CaptureBox, CursorFocusableInput, CursorNavigableForm, Toggle } from 'components/inputs';
import { useMst } from 'store';
import { key_scopes, getLogger } from 'utils';

const log = getLogger('JSX/EditItemModal');

const HELP_MSG = 'Not all keyboard shortcuts can be captured.\nExamples include:\n- Cmd-W (close window)\n- Cmd-Q (quit)';
const KEY_SCOPE = key_scopes.EDIT_ITEM.config.scope;

const EditModal = observer(() => {
    let { editItem, categoryOptions, saveEditItem, clearEditItem } = useMst().edit;

    if (editItem) {
        let {
            label,
            category,
            command,
            commandDefault,
            secondary,
            secondaryDefault,
            enableSecondary
        } = editItem;


        return (
            <KeyScope scope={'EDIT_ITEM'} prevScope={'APP'}>
                <Modal
                    type="small"
                    name="new-shortcut-modal"
                    title="Add/Edit Shortcut"
                    active={true}
                    onClose={clearEditItem}
                    keyscope={KEY_SCOPE}
                    content={
                        <div className="content">
                            <CursorNavigableForm
                                cursorNames={['edit-form-label', 'edit-form-category', 'capture-box' ]}>
                                <FormGroup>
                                    <label className="form-label">Shortcut name:</label>
                                    <CursorFocusableInput
                                        data-keyscope={KEY_SCOPE}
                                        cursorName="edit-form-label"
                                        className="form-input"
                                        name="label"
                                        type="text"
                                        placeholder="Shortcut name"
                                        value={label}
                                        onChange={e => { editItem.updateLabel(e.target.value) }}
                                        tabIndex="0"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <label className="form-label">Group:</label>
                                    <CursorFocusableInput
                                            type="select"
                                            className="form-select"
                                            data-keyscope={KEY_SCOPE}
                                            cursorName="edit-form-category"
                                            name="category"
                                            value={category.id}
                                            onChange={e => { editItem.changeCategory(e.target.value) }}
                                            tabIndex="0">
                                                {categoryOptions.map(i => (
                                                    <option value={i.id} key={'edit_cat_' + i.id}>{i.name}</option>
                                                ))}
                                    </CursorFocusableInput>
                                </FormGroup>
                                <FormGroup>
                                    <label className="form-label tooltip" data-tooltip={HELP_MSG}>Keys:</label>
                                    <CaptureBox
                                        defaultValue={commandDefault}
                                        command={command}
                                        onData={data => editItem.updateCommand(data)}
                                        cursorName="capture-box"/>
                                </FormGroup>
                                <Toggle name={'second-stroke'}
                                        label={'Second stroke'}
                                        checked={enableSecondary}
                                        onChange={val => editItem.updateEnableSecondary(val)}
                                        keyScope={KEY_SCOPE}
                                        tabIndex={0}>
                                            <FormGroup>
                                                <CaptureBox
                                                    defaultValue={secondaryDefault}
                                                    command={secondary}
                                                    onData={data => editItem.updateSecondary(data)}
                                                    cursorName="capture-box-2" />
                                            </FormGroup>
                                </Toggle>
                            </CursorNavigableForm>
                        </div>
                    }
                    footer={
                        <button
                            type="button"
                            data-keyscope={KEY_SCOPE}
                            className="btn btn-primary mx-1"
                            onClick={saveEditItem}>
                                Save
                        </button>
                    }
                />
            </KeyScope>
        );
    }

    return null;
});

export default EditModal;
