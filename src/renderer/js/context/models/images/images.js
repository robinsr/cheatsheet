import { optimize } from 'svgo';

export class CustomImage {
    type = null;

    static fromSnapshot(value) {
        let { type, data, width, height, filename } = value;

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

    get dimensions() {
        return { width: this.width, height: this.height };
    }
}

export class CustomSVGImage extends CustomImage {
    constructor(data, width, height, filename) {
        super('SVG', data, width, height, filename);

        const result = optimize(data, {
            multipass: true
        });

        this.data = result.data;
    }
    getDataURI() {
        const buff = Buffer.from(unescape(encodeURIComponent(this.data)), 'latin1');
        return 'data:image/svg+xml;base64,' + buff.toString('base64');
    }
}

export class CustomPNGImage extends CustomImage {
    constructor(data, width, height, filename) {
        super('PNG', data, width, height, filename);
    }
    getDataURI() {
        return 'data:image/png;base64,' + this.data;
    }
}

