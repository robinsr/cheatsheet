const { BrowserWindow, nativeTheme } = require('electron');
const fs = require('fs');
const path = require('path');
const { DEV, devTools, conf } = require('./config');
const { getLogger } = require('./logger');
const { darken } = require('polished');

const log = getLogger('window');

const vibrancyConfig = {
    transparency: true,
    backgroundColor: '#00000000',
    vibrancy: 'under-window',
    visualEffectState: 'followWindow'
}


/**
 * Creates the application window configured for stage
 * @param {WindowStageOverrides} stageOverrides
 * @param {ISettingsStore} userSettings
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
module.exports.createWindow = (stageOverrides, userSettings) => {

    /** @type {BrowserWindowConstructorOptions} */
    const windowConfig = {
        title: 'Cheat',
        titleBarStyle: 'hidden',
        vibrancy: 'content',
        show: false,
        fullscreenable: false,
        backgroundColor: themeDefaults[getInitialTheme(userSettings)],
        webPreferences: {
            nodeIntegration: true,
            preload: getPreloadScript()
        }
    }

    if (conf.vibrancy) {
        Object.assign(windowConfig, vibrancyConfig);
    }

    Object.assign(windowConfig, stageOverrides);

    log.info('Window config:', windowConfig);

    const win = new BrowserWindow(windowConfig);

    if (DEV) {
        win.loadURL('http://localhost:5173/index.html');
    } else {
        win.loadFile('./dist/index.html');
    }

    if (devTools) {
        win.webContents.openDevTools();
    }

     win.once('ready-to-show', () => {
         if (userSettings.alwaysOnTop) {
             log.info('Setting win.alwaysOnTop to: ', userSettings.alwaysOnTop);
            // BUG; Must set alwaysOnTop after window is created
            win.setAlwaysOnTop(true, 'floating');
        }
    });

    return win;
}


/**
 * Gets the theme to be applied to window on startup
 * @param {ISettingsStore} userSettings
 * @return {"night"|"day"} theme to use
 */
const getInitialTheme = (userSettings) => {
    const systemTheme = nativeTheme.shouldUseDarkColors ? 'night' : 'day';
    if (userSettings.useSystemTheme) {
        return systemTheme;
    } else {
        return userSettings.userTheme || systemTheme;

    }
}

const themeDefaults = {
    night: darken(.97, '#FFF'),
    day: darken(.02, '#FFF')
}

/**
 * Gets the absolute path to preload script.
 * @return {string}
 * @throws {Error} If script does not exist at expected path
 */
const getPreloadScript = () => {
    const preloadPath = path.resolve(__dirname, '../preload/index.js');

    if (!fs.existsSync(preloadPath)) {
        throw new Error('Invalid preload script path: ' + preloadPath);
    }

    return preloadPath;
}
