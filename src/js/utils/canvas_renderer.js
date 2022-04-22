import html2canvas from 'html2canvas';

const render = (e) => {
    return new Promise(resolve => {
        const e_width = e.offsetWidth;
        const e_height = e.offsetHeight;

        html2canvas(e, {
            scale: 2,
            backgroundColor: null,
        }).then(canvas => {
            resolve({
                dataUrl: canvas.toDataURL('image/png', 1.0),
                width: e_width,
                height: e_height
            })
        });
    });
}

export default render;
