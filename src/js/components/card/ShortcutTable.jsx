import React, { Component } from 'react';
import ShortcutKey from './ShortcutKey.jsx';


class Row extends Component {
	constructor(props) {
		super(props)
	}

	edit_item = () => {
		this.props.onEdit(this.props.item)
	}

	render(){
		let { editing } = this.props;
		let { id, label, cmd, edit } = this.props.item;

		if (edit) {
			return (
				<tr key="row-new">
					<td colSpan="2" className="text-center"><em>editing...</em></td>
				</tr>
			);
		}

		return (
			<tr key={id}>
				<td>
					{editing ? <i className="icon icon-cross"></i> : null}
					<span onClick={this.edit_item} style={{cursor: 'pointer'}}>{label}</span>
				</td>
				<td className="text-right">
					<ShortcutKey
					command={cmd}
					item={this.props.item}
					/>
				</td>
			</tr>
		)
	}
}


export default class ShortcutTable extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		let { items, editing } = this.props

		return (
			<table className="table shortcut-table">
				<thead>
					<tr>
						<th>Name</th>
						<th className="text-right">Shortcut</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => <Row item={item} key={item.id} {...this.props} />)}
				</tbody>
			</table>
		)
	}
}
