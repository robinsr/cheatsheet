import './ShortcutTable.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { useMst } from 'context/Store.jsx';
import ShortcutKey from './ShortcutKey.jsx';
import {getPath} from "mobx-state-tree";


const Row = observer(({ item, editing }) => {
    let { items, cursor, setCursor } = useMst()

    let { id, label, command } = item;
    let itemPath = getPath(item);

    function onClick(e) {
        console.log(e);
        if (e.nativeEvent.which === 3) {
            if (e.nativeEvent.shiftKey) {
                items.moveItemUp(id);
            } else {
                items.moveItemDown(id);
            }
            return
        }

        if (editing) {
            return;
        } else {
            items.setEditItem(id)
        }
    }

    let cls = classnames('shortcut-table-item', {
        'active': id === cursor
    });

    return (
        <tr key={id} className={cls}
            onClick={onClick}
            onAuxClick={onClick}
            onMouseEnter={() => setCursor(id)}
            onMouseLeave={() => setCursor(null)}>
            <td>
                {editing ? <i className="icon icon-cross remove-shortcut" onClick={e => items.removeItem(id)}></i> : null}
                <span>{label}</span>
            </td>
            <td className="text-right">
                <ShortcutKey item={item} command={command} capture={true}/>
            </td>
        </tr>
    )
});

const ShortcutTable = ({ items, editing }) => {
    return (
        <table className="table shortcut-table">
            <thead>
            <tr>
                <th>Name</th>
                <th className="text-right">Shortcut</th>
            </tr>
            </thead>
            <tbody>
            {items.map(item => <Row item={item} key={item.id} editing={editing} />)}
            </tbody>
        </table>
    )
};

export default ShortcutTable
