import './ShortcutTable.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { useMst } from 'context/Store';
import ShortcutKey from './ShortcutKey.jsx';


const Row = observer(({
    item, editing, onMoveUp, onMoveDown, onDelete
}) => {
    let { edit, cursor, setCursor } = useMst();

    let { id, label, command, secondary } = item;

    function onRightClick(e) {
        if (e.nativeEvent.which === 3) {
            e.nativeEvent.shiftKey ? onMoveUp(id) : onMoveDown(id);
        }
    }

    function onClick(e, target) {
        if (editing) return;
        e.stopPropagation();

        if (target === 'label') {
            setCursor('edit-form-label');
        }
        else if (target === 'key1') {
            setCursor('capture-box');
        }
         else if (target === 'key2') {
            setCursor('capture-box-2');
        }

        edit.setEditItem(item);
    }

    let cls = classnames('shortcut-table-item', {
        'active': id === cursor
    });

    return (
        <tr className={cls}
            onClick={(e) => onClick(e, 'label')}
            onAuxClick={onRightClick}
            >
            <td>
                {editing ? <i className="icon icon-cross remove-shortcut"
                              onClick={() => onDelete(id)}></i> : null}
                <span>{label}</span>
            </td>
            <td className="text-right">
                <ShortcutKey item={item} command={command} capture={false} onClick={(e) => onClick(e, 'key1')} />
                {secondary
                    ? <span>
                        <strong> + </strong>
                        <ShortcutKey item={item} command={secondary} capture={false} onClick={(e) => onClick(e, 'key2')} />
                      </span>
                    : null}
            </td>
        </tr>
    )
});

const ShortcutTable = observer(({ group, editing }) => {

    return (
        <table className="table shortcut-table">
            <thead>
            <tr>
                <th>Name</th>
                <th className="text-right">Shortcut</th>
            </tr>
            </thead>
            <tbody>
            {group.items.map(item => (
                <Row item={item}
                     key={'table_item_' + item.id}
                     editing={editing}
                     onMoveUp={() => group.moveItemUp(item.id)}
                     onMoveDown={() => group.moveItemDown(item.id)}
                     onDelete={() => group.removeItem(item.id)}
                />
            ))}
            </tbody>
        </table>
    )
});

export default ShortcutTable
