import React from 'react';


const DATA_URI_PREFIX = {
    svg: 'data:image/svg+xml;base64,',
    png: 'data:image/png;base64,'
}

const DataURIImage = ({
    imageModel
}) => {

    if (!imageModel || !imageModel.getDataURI) {
        return null;
    }

    let { width, height } = imageModel.dimensions;

    return (
        <img className="" src={imageModel.getDataURI()} width={width} height={height} />
    );
}

export default DataURIImage;
