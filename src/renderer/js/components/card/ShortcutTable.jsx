import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from 'context/Store.jsx';
import ShortcutKey from './ShortcutKey.jsx';


const Row = observer(({ item, editing }) => {
	let { items } = useMst()
	
	let { id, label, command } = item;

	function onClick() {
		if (editing) {
			return;
		} else {
			items.setEditItem(id)
		}
	}


	return (
		<tr key={id} className="shortcut-table-item" onClick={onClick}>
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
