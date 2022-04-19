import React, { Component } from 'react';

import { AppContext } from 'context/Store';

import copy_to_clip from 'utils/clipboard';



const GenericModal = (props) => {
    return (
        <div className={'modal modal-lg ' + (props.active ? 'active' : '')}>
            <a href="#close" className="modal-overlay" aria-label="Close" onClick={props.onClose}></a>
            <div className="modal-container">
                <div className="modal-header">
                    <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={props.onClose}></a>
                    <div className="modal-title h5">{props.title}</div>
                </div>
                <div className="modal-body">
                    {props.content}
                </div>
                <div className="modal-footer">
                    <div className="docs-demo columns">
                        <div className="column col-12">
                            {props.footer}
                            <button className="btn btn-default" onClick={props.onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default class ExportModal extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
    }

    close = (e) => {
        this.context.items.close_export_window()
    }

    copy_markdown = () => {
        let { markdown_val } = this.context.items;

        copy_to_clip(markdown_val)
            .then(console.log) // todo
            .catch(console.log) // todo
    }


    render_isLoading = () => {
        let { progress, show_markdown } = this.context.items;

        return (
            <GenericModal 
                title={'Export to Markdown'}
                active={show_markdown}
                onClose={() => this.close()}
                content={
                    <div className="content">
                        <p>Getting the table right now...</p>
                        <progress className="progress" value={progress} max="100"></progress>
                    </div>
                }
            />
        );
    }

    render_result = () => {
        let { markdown_val, show_markdown } = this.context.items;

        return (
            <GenericModal 
                title={'Export to Markdown'}
                active={show_markdown}
                onClose={() => this.close()}
                content={
                    <div className="content">
                        <pre>{markdown_val}</pre>
                    </div>
                }
                footer={
                    <button className="btn btn-primary" onClick={this.copy_markdown}>
                        <i className="icon icon-copy"></i> Copy markdown
                    </button>
                }
            />
        )
    }


    render() {
        let { markdown_val } = this.context.items;

        return markdown_val == null ? this.render_isLoading() : this.render_result()
    }
}
