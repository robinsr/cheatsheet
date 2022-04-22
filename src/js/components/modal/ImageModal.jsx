import React from 'react';
import { observer } from 'mobx-react-lite';

import Modal from 'components/modal/Modal';

import { useMst } from 'context/Store';
import copy_to_clip from 'utils/clipboard';


const ImageModal = observer(() => {
    let { png } = useMst();

    if (png.imageData) {
        let { dataUrl, width, height } = png.imageData;

        return (
            <Modal 
                title={'Export PNG'}
                active={png.showModal}
                onClose={() => png.closeModal()}
                content={
                    <div className="content">
                        <div className="text-center download-container">
                            <div className="p-centered download-image">
                                <div>
                                    <img className="" src={'' + dataUrl} width={width} height={height} />
                                </div>
                                <div>
                                    <a className="btn btn-primary" href={dataUrl} download={'filename.png'}>
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

})

export default ImageModal;
