import { resolvePath } from 'mobx-state-tree';
import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { MobxEditableShortcutItem } from 'store/edit/EditItemStore';
import { MobxShortcut } from 'store/types/Shortcut';
import { ITEM, EDIT_ITEM } from 'utils/paths';
import useCursor from 'hooks/useCursor';
import useHistory from 'hooks/useHistory';
import Modal from './Modal';
import KeyScope from 'components/providers/KeyScope';
import { Button, CaptureBox, CursorFocusableInput, CursorNavigableForm, Toggle } from 'components/inputs';
import { useMst } from 'store';
import { getLogger } from 'utils';

const log = getLogger('JSX/EditItemModal');

const HELP_MSG = 'Not all keyboard shortcuts can be captured.\nExamples include:\n- Cmd-W (close window)\n- Cmd-Q (quit)';

const EditModal = observer(() => {
    let root = useMst();
    let { back } = useHistory();
    let { matches, params } = useCursor(EDIT_ITEM);

    const [ original, editItem, categoryOptions ] = useMemo(() => {
        if (!matches) {
            return [ null, null ];
        }

        /** @type {IShortcutItem} **/
        const original = resolvePath(root, ITEM.path(params));
        const copy = Object.assign({}, original.toJSON(), {
            id: 'EDIT-' + original.id,
            enableSecondary: !!original.secondary,
            categoryId: original.category.id
        });
        const editItem = MobxEditableShortcutItem.create(copy);
        const options = original.app.categories.toJSON();

        return [ original, editItem, options ];
    }, [ matches ]);


    if (!editItem) {
        return null;
    }

    const clear = () => back();

    const save = () => {
        original.update('label', editItem.label);

        // Replace command/secondary Shortcuts with new MST models
        [ 'command', 'secondary' ].forEach(field => {
            original.update(field, MobxShortcut.create(editItem[field].toJSON()));
        })

        if (editItem.categoryId !== original.category.id) {
            log.info('Change cat needed')
        }

        back();
    }

    const onAction = (evt) => {
        log.info('EditItemModal key event', evt);
        if (evt.actionName === 'EDIT_ITEM:SAVE_EDIT_ITEM') {
            save();
        }
    }

    return (
        <KeyScope scope={'EDIT_ITEM'} prevScope={'APP'} onAction={onAction}>
            <Modal
                type="small"
                name="new-shortcut-modal"
                title="Add/Edit Shortcut"
                active={true}
                onClose={clear}
                keyscope={'EDIT_ITEM'}
                content={
                    <div className="content">
                        <CursorNavigableForm
                            cursorNames={['edit-form-label', 'edit-form-category', 'capture-box' ]}>
                            <div className="form-group">
                                <label className="form-label">Shortcut name:</label>
                                <CursorFocusableInput
                                    data-keyscope={'EDIT_ITEM'}
                                    cursorName="edit-form-label"
                                    className="form-input"
                                    name="label"
                                    type="text"
                                    placeholder="Shortcut name"
                                    value={editItem.label}
                                    onChange={e => { editItem.updateLabel(e.target.value) }}
                                    tabIndex="0"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Group:</label>
                                <CursorFocusableInput
                                        type="select"
                                        className="form-select"
                                        data-keyscope={'EDIT_ITEM'}
                                        cursorName="edit-form-category"
                                        name="category"
                                        value={editItem.categoryId}
                                        onChange={e => { editItem.changeCategory(e.target.value) }}
                                        tabIndex="0">
                                            {categoryOptions.map(i => (
                                                <option value={i.id} key={'edit_cat_' + i.id}>{i.name}</option>
                                            ))}
                                </CursorFocusableInput>
                            </div>
                            <div className="form-group">
                                <label className="form-label tooltip" data-tooltip={HELP_MSG}>Keys:</label>
                                <CaptureBox
                                    defaultValue={editItem.commandDefault}
                                    command={editItem.command}
                                    onData={data => editItem.updateCommand(data)}
                                    cursorName="capture-box-primary"/>
                            </div>
                            <Toggle name={'second-stroke'}
                                    label={'Second stroke'}
                                    checked={editItem.enableSecondary}
                                    onChange={val => editItem.updateEnableSecondary(val)}
                                    keyScope={'EDIT_ITEM'}
                                    tabIndex={0}
                                    reveal={
                                        <div className="form-group">
                                            <CaptureBox
                                                defaultValue={editItem.secondaryDefault}
                                                command={editItem.secondary}
                                                onData={data => editItem.updateSecondary(data)}
                                                cursorName="capture-box-secondary"/>
                                        </div>
                                    }
                            />
                        </CursorNavigableForm>
                    </div>
                }
                footer={
                    <Button primary
                        type="button"
                        data-keyscope={'EDIT_ITEM'}
                        className="mx-1"
                        onClick={save}>
                            Save
                    </Button>
                }
            />
        </KeyScope>
    );
});

export default EditModal;
