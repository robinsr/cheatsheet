import React from 'react';

const DownloadButton = ({
    imageModel
}) => {

    if (!imageModel) {
        return null;
    }


    const onClick = (e) => {
        // send blob?
        window.keymap_api.saveFile(imageModel)
            .then(filePath => {
                console.log('success!');
                console.log(filePath);
            })
            .catch(err => {
                console.error(err);
            })
    }

    return (
        <button className="btn btn-primary" onClick={onClick}>
            <i className="icon icon-download"></i> Download
        </button>
    );
}

export default DownloadButton;
