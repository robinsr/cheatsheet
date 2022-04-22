import React, { Component, createRef } from 'react';
import serialize from 'form-serialize';
import { Button, FormGroup, Input } from 'spectre-react';

import Modal from 'components/modal/Modal';
import CaptureBox from 'components/modal/CaptureBox';
import { AppContext } from 'context/Store';

const key_msg = 'Not all keyboard shortcuts can be captured.\nExamples include:\n- Cmd-W (close window)\n- Cmd-Q (quit)';

export default class NewItemModal extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.formRef = createRef();
        this.nameInputRef = createRef();
        this.categoryRef = createRef();
        this.cmdRef = createRef();
        this.saveRef = createRef();

        this.state = {
            name: null,
            group: null,
            cmd: null
        }
    }

    componentDidMount() {
        this.nameInputRef.current.focus();
    }

    close = (e) => {
        let { new_item, edit_item, update_item, remove_item } = this.context.items;

        if (new_item) {
            return remove_item(new_item);
        }

        if (edit_item) {
            return update_item(Object.assign(edit_item, {
                is_editing: false, is_new: false
            }))
        }
    }

    capture_keys = (data) => {
        console.debug("captured: ", data)
        let { capture, tab_out } = data;

        this.cmdRef.current.value = capture;

        if (tab_out) {
            this.saveRef.current.focus();
        }
    }

    handle_save = (e) => {
        let { new_item, edit_item, update_item } = this.context.items; 

        let form_data = serialize(this.formRef.current, { hash: true });

        console.debug("Form data: ", form_data);

        update_item(Object.assign(new_item || edit_item, form_data, {
            is_editing: false, is_new: false
        }))
    }

    render() {
        let { item_groups, new_item, edit_item } = this.context.items;

        let temp_item = Object.assign({}, new_item || edit_item);

        if (new_item) {
            temp_item = {
                
            }
        }

        return (
            <Modal 
                type={'modal-sm'}
                name={'new-shortcut-modal'}
                title={'Add/Edit Shortcut'}
                active={new_item != null || edit_item != null}
                onClose={() => this.close()}
                content={
                    <div className="content">
                        <form ref={this.formRef}>
                            <FormGroup>
                                <label className="form-label">Shortcut name:</label>
                                <input className="form-input" 
                                    name="label"
                                    type="text"
                                    placeholder="Shortcut name"
                                    defaultValue={temp_item.label}
                                    tabIndex="0"
                                    ref={this.nameInputRef}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-label">Group:</label>
                                <select className="form-select"
                                    name="category"
                                    defaultValue={temp_item.category}
                                    tabIndex="0"
                                    ref={this.categoryRef}>
                                        {item_groups.map(i => (
                                            <option value={i} key={i}>{i}</option>
                                        ))}
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <label className="form-label tooltip" data-tooltip={key_msg}>Keys:</label>
                                <input type="hidden" name="cmd" defaultValue={temp_item.cmd} ref={this.cmdRef} />
                                <CaptureBox defaultValue={temp_item.cmd} onData={this.capture_keys} />

                            </FormGroup>
                        </form>
                    </div>
                }
                footer={
                    <button className="btn btn-primary mx-1" ref={this.saveRef} onClick={this.handle_save}>Save</button> 
                }
            />
        );
    }
}
