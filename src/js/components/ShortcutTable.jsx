import React, { Component } from 'react';
import ShortcutKey from 'components/ShortcutKey.jsx';


class Row extends Component {
	render(){
		let { label, cmd } = this.props.item;

		return (
			<tr key="row-{cmd}">
	            <td>{label}</td>
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
	render() {
		let { items } = this.props

		return (
			<table className="table shortcut-table">
				<thead>
					<tr>
						<th>Name</th>
						<th className="text-right">Shortcut</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => <Row item={item} key={item.cmd} />)}
				</tbody>
			</table>
		)
	}
}
