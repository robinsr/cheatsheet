import React, { Component } from 'react';
import * as _ from 'lodash';
import { Button, Card, CardHeader, CardTitle, CardBody } from 'spectre-react';


import { AppContext } from 'context/Store';
import ShortcutTable from 'components/ShortcutTable';


export default class ShortcutCards extends Component {
    static contextType = AppContext;

    export_png = () => {

    }

    export_md = () => {

    }

    render() {
        let { items } = this.context.items;

        let item_groups = _.groupBy(items, i => i.category);

        return (
            <div className="shortcut-cards columns">
                {Object.keys(item_groups).map(group => (
                    <div className="column col-6 col-xs-12">
                        <Card className="shortcut-card" key={'shortcut-card-' + group}>
                            <CardHeader>
                                <div className="dropdown float-right">
                                    <Button className="dropdown-toggle" primary={true}>
                                        <i className="icon icon-download"></i>
                                    </Button>
                                    <ul class="menu export-menu">
                                        <li class="menu-item"><a onClick={this.export_png}>PNG</a></li>
                                        <li class="menu-item"><a onClick={this.export_md}>Markdown</a></li>
                                  </ul>
                                </div>
                                <CardTitle className="h5">{group}</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ShortcutTable items={item_groups[group]} />
                            </CardBody>
                        </Card>
                    </div>
                ))}
            </div>
        );
    }
}