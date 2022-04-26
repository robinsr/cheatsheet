/* Main/Renderer */

import { optimize } from 'svgo';

export class CustomImage {
    type = null;

    static fromSnapshot(value) {
        let { type, data, width, height, filename } = value;

        if (type == 'SVG') {
            return new CustomSVGImage(data, width, height, filename);
        } else if (type == 'PNG') {
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

    get dimensions() {
        return { width: this.width, height: this.height };
    }

    getBuffer() {
        throw new Error('Not implemented');
    }

    getDataURI() {
        throw new Error('Not implemented');   
    }
}

export class CustomSVGImage extends CustomImage {
    static ext = '.svg';
    static dataURIPrefix = 'data:image/svg+xml;base64,';

    constructor(data, width, height, filename) {
        super('SVG', data, width, height, filename);

        const result = optimize(data, {
            multipass: true
        });

        this.data = result.data;
    }

    getBuffer() {
        return Buffer.from(this.data)
    }

    getDataURI() {
        const buff = Buffer.from(unescape(encodeURIComponent(this.data)), 'latin1');
        return CustomSVGImage.dataURIPrefix + buff.toString('base64');
    }

    getFilename() {
        return this.filename + CustomSVGImage.ext;
    }
}

export class CustomPNGImage extends CustomImage {
    static ext = '.png';
    static dataURIPrefix = 'data:image/png;base64,';

    constructor(data, width, height, filename) {
        super('PNG', data, width, height, filename);
    }

    getBuffer() {
        return Buffer.from(this.data, 'base64');
    }

    getDataURI() {
        return CustomPNGImage.dataURIPrefix + this.data;
    }

    getFilename() {
        return this.filename + CustomPNGImage.ext;
    }
}

