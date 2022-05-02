import React from 'react';

const noop = (data) => console.log(data);

const DownloadButton = ({
    imageModel, onSave=noop, onError=noop
}) => {

    if (!imageModel) {
        return null;
    }


    const onClick = (e) => {
        
        window.cheatsheetAPI.saveImage(imageModel)
            .then(filePath => {
                if (filePath) {
                    onSave(`Iamge saved to ${filePath}`)
                } 
                
            })
            .catch(err => {
                onError(err);
            });
    }

    return (
        <button className="btn btn-primary" onClick={onClick}>
            <i className="icon icon-download"></i> Download
        </button>
    );
}

export default DownloadButton;
