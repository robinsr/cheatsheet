const activeWindows = require('electron-active-window');
const { conf } = require('../shared/config');
const log = require('./logger').getLogger('activewindow');

module.exports = function ActiveWindow(win) {
    /**
     * Active window event.
     *
     * @event App#app:stateChange:window
     * @type {object}
     * @property {string} windowName - Active window (eg "Google Chrome")
     */
    function getActiveWindow() {
        activeWindows().getActiveWindow().then(result => {
            win.webContents.send('app:window-change', {
                windowName: result.windowName
            });
        });
    }

    let pollActiveWindow;

    win.on('focus', (e) => {
        win.webContents.send('app:focus');
        win.webContents.send('app:window-change', {
            windowName: conf.name
        });
        clearInterval(pollActiveWindow);
    });

    win.on('blur', (e) => {
        win.webContents.send('app:blur');
        getActiveWindow()
        pollActiveWindow = setInterval(getActiveWindow, 1000);
    });

    return {
        startPolling: () => {
            if (pollActiveWindow === undefined) {
                log.debug('Starting active window polling');
                pollActiveWindow = setInterval(getActiveWindow, 1000);
            }
        },
        stopPolling: () => {
            log.debug('Stopping active window polling');
            clearInterval(pollActiveWindow);
        }
    }
}
