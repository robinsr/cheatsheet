import React, { Component } from 'react';

export default class ErrorAlert extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        let { error, onClear, children } = this.props

        return (
            <div className="error-alert">
                {error
                    ? <div className="toast toast-error">
                        <button className="btn btn-clear float-right" onClick={onClear}></button>
                        <details className="accordion">
                            <summary className="accordion-header">
                                <i className="icon icon-arrow-right mr-1"></i>
                                Something went wrong... [{ error.message }]
                            </summary>
                            <div className="accordion-body">
                                { error.stack }
                            </div>
                        </details>
                    </div>
                    : null}
                { children }
            </div>
        )
    }
}
