import React, { Component } from 'react';

import Modal from 'components/modal/Modal';
import { AppContext } from 'context/Store';
import copy_to_clip from 'utils/clipboard';


export default class ExportModal extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
    }

    close = (e) => {
        this.context.items.close_export_window()
    }

    render() {
        let { show_image_modal, image_data } = this.context.items;

        if (image_data) {
            let { data_url, width, height } = image_data;

            return (
                <Modal 
                    title={'Export PNG'}
                    active={show_image_modal}
                    onClose={() => this.close()}
                    content={
                        <div className="content">
                            <div className="text-center download-container">
                                <div className="p-centered download-image">
                                    <div>
                                        <img className="" src={'' + data_url} width={width} height={height} />
                                    </div>
                                    <div>
                                        <a className="btn btn-primary" href={data_url} download={'filename.png'}>
                                            <i className="icon icon-download"></i> Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />
            );
        }

        return null;
    }
}
