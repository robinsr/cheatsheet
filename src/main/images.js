const gm = require('gm');

class CustomImage {
    type = null;

    static fromData(imageData) {
        let { type, data, width, height, filename } = imageData;

        if (type === 'SVG') {
            return new CustomSVGImage(data, width, height, filename);
        } else if (type === 'PNG') {
            return new CustomPNGImage(data, width, height, filename);
        }
    }
    
    constructor(type, data, width, height, filename) {
        this.type = type;
        this.data = data;
        this.width = width;
        this.height = height;
        this.filename = filename;
    }
}

class CustomSVGImage extends CustomImage {
    static ext = '.svg';

    constructor(data, width, height, filename) {
        super('SVG', data, width, height, filename);
    }

    getBuffer() {
        return Promise.resolve(Buffer.from(this.data));
    }

    getFilename() {
        return this.filename + CustomSVGImage.ext;
    }
}

class CustomPNGImage extends CustomImage {
    static ext = '.png';

    constructor(data, width, height, filename) {
        super('PNG', data, width, height, filename);
    }

    getBuffer() {
        return new Promise((resolve, reject) => {
            /**
             * TODO; this still produces grainy images
             * Ideally it would produce an image with
             * * Pixel dimensions = 2x 
             * * DPI dimensions = 144
             */
            gm(Buffer.from(this.data, 'base64'))
                .units('PixelsPerInch')
                .resample(144, 144)
                .density(144, 144)
                .resize(this.width*2, this.height*2)
                .toBuffer('PNG', (err, buffer) => {
                    if (err) return reject(err);
                    resolve(buffer)
                });
        });
    }

    getFilename() {
        return this.filename + CustomSVGImage.ext;
    }
}

module.exports = { CustomImage, CustomSVGImage, CustomPNGImage };
