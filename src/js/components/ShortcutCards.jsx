import React, { Component } from 'react';
import * as _ from 'lodash';

import { AppContext } from 'context/Store';
import ShortcutTable from 'components/ShortcutTable';
import ShortcutCard from 'components/ShortcutCard';


export default class ShortcutCards extends Component {
    static contextType = AppContext;

    render() {
        let { items } = this.context.items;

        let item_groups = _.groupBy(items, i => i.category);

        return (
            <div className="shortcut-cards">
                {Object.keys(item_groups).map(group => (
                    <ShortcutCard key={'shortcut-card-' + group} group={group} items={item_groups[group]} />
                ))}
            </div>
        );
    }
}