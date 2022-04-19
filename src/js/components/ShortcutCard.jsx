import React, { Component, createRef } from 'react';
import { Button, Card, CardHeader, CardTitle, CardBody } from 'spectre-react';

import render from 'utils/canvas_renderer';
import { AppContext } from 'context/Store';
import ShortcutTable from 'components/ShortcutTable';


export default class ShortcutCard extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.cardRef = createRef();
        this.menuRef = createRef();
    }

    export_png = () => {
        this.menuRef.current.style.display = 'none';

        render(this.cardRef.current)
            .then(image_data => {
                this.context.items.show_image(image_data);
                this.menuRef.current.style.display = 'block';
            })
    }

    export_md = (group) => {
        this.context.items.export_markdown(group);
    }

    render() {
        let { items, group } = this.props;

        return (
            <div className="shortcut-card" key={'shortcut-card-' + group} ref={this.cardRef}>
                <Card>
                    <CardHeader>
                        <div className="dropdown float-right" ref={this.menuRef}>
                            <Button className="dropdown-toggle" primary={true}>
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
                        <CardTitle className="h5">{group}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ShortcutTable items={items} />
                    </CardBody>
                </Card>
            </div>
        );
    }
}