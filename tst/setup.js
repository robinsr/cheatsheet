const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const page = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://www.example.com/',
    referrer: 'https://www.example.com/',
    contentType: 'text/html',
    storageQuota: 10000000
});

const { window } = page;


function copyProps(src, target) {
    Object.defineProperties(target, {
        ...Object.getOwnPropertyDescriptors(src),
        ...Object.getOwnPropertyDescriptors(target),
    });
}

global.window = window;
global.document = window.document;

const navigator = {
    userAgent: 'node.js',
    keyboard: {
        // TODO, mock navigator.getLayoutMap
        getLayoutMap: () => Promise.resolve({
            keys: () => ({
                next: () => ({
                    done: true
                })
            })
        })
    }
};

global.requestAnimationFrame = function (callback) {
    return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};

copyProps(window, global);
copyProps(navigator, window.navigator);

window.cheatsheetAPI = require('./mockAPI');
