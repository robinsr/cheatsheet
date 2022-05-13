

/** @class */
export class CustomImage {
    /**
     * Image type
     *  @member {"SVG"|"PNG"} type
     **/
    type = null;

    /**
     * Converts a snapshot (plain object) to a CustomImage
     * @param {object} value - snapshot value
     * @return {CustomImage}
     */
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

        /**
         * image data
         * @member {string} data
         **/
        this.data = data;

        /**
         * Image width in pixels
         * @member {number} width
         **/
        this.width = width;

        /**
         * Image height in pixels
         * @member {number} height
         **/
        this.height = height;

        /**
         * Filename to use when saving image
         * @member {string} filename
         **/
        this.filename = filename;
    }

    /**
     * Gets the image dimensions
     * @returns {{width, height}}
     */
    get dimensions() {
        return { width: this.width, height: this.height };
    }

    /**
     * @interface
     * @description Get the data-uri value
     * @returns {string} data-uri display string
     */
    getDataURI() {
        throw new Error('Not implemented');
    }
}

export class CustomSVGImage extends CustomImage {
    constructor(data, width, height, filename) {
        super('SVG', data, width, height, filename);
    }
    getDataURI() {
        const buff = Buffer.from(unescape(encodeURIComponent(this.data)), 'latin1');
        return 'data:image/svg+xml;base64,' + buff.toString('base64');
    }
}

export class CustomPNGImage extends CustomImage {
    constructor(data, width, height, filename) {
        super('PNG', data.replace('data:image/png;base64,', ''), width, height, filename);
    }
    getDataURI() {
        return 'data:image/png;base64,' + this.data;
    }
}

