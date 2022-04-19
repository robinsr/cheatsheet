import React, { Component, createRef, useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardBody } from 'spectre-react';

import render from 'utils/canvas_renderer';
import { ShowHideElement } from 'utils/dom';
import { AppContext } from 'context/Store';
import ShortcutTable from 'components/ShortcutTable';


export default class ShortcutCard extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.cardRef = createRef();
        this.menuRef = createRef();
        this.addItemRef = createRef()

        this.state = {
            edit: false,
            edit_group: this.props.group
        }
    }

    export_png = () => {
        let e = new ShowHideElement([
            this.menuRef.current, this.addItemRef.current
        ]);
        e.hide();

        render(this.cardRef.current)
            .then(image_data => {
                e.show();
                this.context.items.show_image(image_data);
            })
            .catch(e.show())
    }

    export_md = (group) => {
        this.context.items.export_markdown(group);
    }

    update_group = (e) => {
        this.setState(() => ({
            edit_group: e.target.value
        }));
    }

    toggle_edit = () => {
        this.setState(state => ({
            edit: !state.edit
        }));
    }

    add_item = () => {
        this.context.items.add_item({
            category: this.props.group,
            is_editing: true
        });
    }

    edit_item = (item) => {
        this.context.items.update_item(Object.assign(item, {
            is_editing: true
        }));
    }

    render() {
        let { edit, edit_group } = this.state;
        let { items, group } = this.props;

        return (
            <div className="shortcut-card" key={'shortcut-card-' + group} ref={this.cardRef}>
                <Card>
                    <CardHeader>
                        <div className="dropdown float-right" ref={this.menuRef}>
                            <Button 
                                className="mx-1"
                                primary={!edit}
                                success={edit}
                                small={true}
                                onClick={this.toggle_edit}>
                                    {edit
                                        ? <i className="icon icon-check"></i>
                                        : <i className="icon icon-edit"></i>}
                            </Button>
                            <Button className="dropdown-toggle" primary={true} small={true}>
                                <i className="icon icon-download"></i>
                            </Button>
                            <ul className="menu export-menu">
                                <li className="menu-item">
                                    <a onClick={() => this.export_png(group)}>PNG</a>
                                </li>
                                <li className="menu-item">
                                    <a onClick={() => this.export_md(group)}>Markdown</a>
                                </li>
                          </ul>
                        </div>
                        <CardTitle className="h5">
                            {edit ? <input type="text" value={edit_group} onChange={this.update_group} /> : group}
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ShortcutTable items={items} editing={edit} onEdit={this.edit_item}/>
                        <div className="row-new-cmd text-center" ref={this.addItemRef}>
                            <a onClick={this.add_item} className="btn btn-link">+</a>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}