import React from 'react';
import { Button } from 'components/inputs';
import { getLogger } from 'utils';

const log = getLogger('JSX/DownloadButton');

const noop = (data) => console.log(data);

const DownloadButton = ({
    imageModel, onSave=noop, onError=noop
}) => {

    if (!imageModel) {
        return null;
    }

    const onClick = async (e) => {
        try {
            const filepath = await window.cheatsheetAPI.image.save(imageModel);
            log.info('File save success', filepath);
            onSave(filepath);
        } catch (err) {
            log.error('File save failed', err);
            onError(err);
        }
    }

    return (
        <Button primary onClick={onClick}>
            <i className="icon icon-download"></i> Download
        </Button>
    );
}

export default DownloadButton;
