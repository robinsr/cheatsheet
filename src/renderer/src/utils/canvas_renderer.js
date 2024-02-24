import html2canvas from 'html2canvas';
import { changeDpiDataUrl } from 'changedpi';
// TODO dom-to-svg breaks jest unit tests. Maybe move to backend process instead of browser
import { elementToSVG, inlineResources } from 'dom-to-svg';
// import optimize from 'svgo-browser/lib/optimize';

import { CustomPNGImage, CustomSVGImage } from 'utils/images.js';

const renderPNG = (e) => {
    return new Promise(resolve => {
        const e_width = e.offsetWidth;
        const e_height = e.offsetHeight;

        html2canvas(e, {
            scale: 2,
            backgroundColor: null,
        }).then(canvas => {
            let dataURI = changeDpiDataUrl(canvas.toDataURL('image/png', 1.0), 300);
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

            optimize(svgString).then(data => {
                resolve(new CustomSVGImage(data, e_width, e_height));
            });
        });
    });
}

export { renderPNG, renderSVG };
