import React from 'react';
import { observer } from 'mobx-react-lite';

import Modal from 'components/modal/Modal.jsx';
import { DataURIImage, DownloadButton } from 'components/image';

import { useMst } from 'context/Store.jsx';
import copy_to_clip from 'utils/clipboard';


const ImageModal = observer(() => {
    let { imageModal } = useMst();

    if (imageModal.data) {

        return (
            <Modal 
                name="image-modal"
                title={'Export ' + imageModal.data.type}
                active={imageModal.showModal}
                onClose={() => imageModal.closeModal()}
                content={
                    <div className="content">
                        <div className="text-center download-container">
                            <div className="p-centered download-image">
                                <div>
                                    <DataURIImage imageModel={imageModal.data}/>
                                </div>
                                <div>
                                    <DownloadButton imageModel={imageModal.data}/>
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
