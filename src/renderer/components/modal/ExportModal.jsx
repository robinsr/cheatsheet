import React, { Component } from 'react';

import Modal from './Modal.jsx';
import { Button } from 'components/inputs';
import { AppContext } from 'store';
import copy_to_clip from 'utils/clipboard.js';


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
            <Modal 
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
            <Modal
                type="full"
                title={'Export to Markdown'}
                active={show_markdown}
                onClose={() => this.close()}
                content={
                    <div className="content">
                        <pre>{markdown_val}</pre>
                    </div>
                }
                footer={
                    <Button primary onClick={this.copy_markdown}>
                        <i className="icon icon-copy"></i> Copy markdown
                    </Button>
                }
            />
        )
    }


    render() {
        let { markdown_val } = this.context.items;

        return markdown_val == null ? this.render_isLoading() : this.render_result()
    }
}
