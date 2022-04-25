import html2canvas from 'html2canvas';
import { changeDpiDataUrl } from 'changedpi'; 
import { CustomPNGImage, CustomSVGImage } from './images';

const { documentToSVG, elementToSVG, inlineResources } = require('dom-to-svg');
const { optimize } = require('svgo');



const renderPNG = (e) => {
    return new Promise(resolve => {
        const e_width = e.offsetWidth;
        const e_height = e.offsetHeight;

        html2canvas(e, {
            scale: 2,
            backgroundColor: null,
        }).then(canvas => {
            let highDensityDataURI = changeDpiDataUrl(canvas.toDataURL('image/png', 1.0), 300);
            let dataURI = highDensityDataURI.replace(CustomPNGImage.dataURIPrefix, '');

            // let dataURI = canvas.toDataURL('image/png', 0.92).replace(CustomPNGImage.dataURIPrefix, '');
            
            resolve(new CustomPNGImage(dataURI, e_width, e_height));
        });
    });
}

const DATA_SVG_PREFIX = 'data:image/svg+xml;base64,';

const renderSVG = (e) => {
    return new Promise(resolve => {
        const e_width = e.offsetWidth;
        const e_height = e.offsetHeight;

        const svgDocument = elementToSVG(e);

        inlineResources(svgDocument.documentElement).then(() => {
            let svgString = new XMLSerializer().serializeToString(svgDocument);

            resolve(new CustomSVGImage(svgString, e_width, e_height));
        });
    });
}

export { renderPNG, renderSVG };
