import React from 'react';


export default class Shortcut extends React.Component {
	render() {
        let {} = this.props

		return (
            <span id={"kbd-${command}"} className="label shortcut img-target">
                {kbds.join("+")}
            </span>
        );
	}
};
