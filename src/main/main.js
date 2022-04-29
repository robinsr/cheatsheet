const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const os = require('os')

const activeWindows = require('electron-active-window');

const IS_DEV = process.env.ELECTRON_DEV === 'true';

const devToolsBath = path.join(
   os.homedir(),
   '/Library/Application Support/Google/Chrome/Default/Extensions/pfgnfdagidkfgccljigdamigbcnndkod/0.9.26_0'
 );


const dimensions = {
    dev: {
        width: 2000, height: 1600
    },
    prod: {
        width: 450, height: 980
    }
}

const createWindow = () => {
    const windowConfig = {
        title: 'Cheat',
        titleBarStyle: 'hiddenInset',
        // titleBarOverlay: {
        //   color: '#2f3241',
        //   symbolColor: '#74b1be'
        // },
        vibrancy: 'content',
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, './preload.js'),
            additionalArguments: [ ( IS_DEV ? 'IS_DEV' : null ) ]
        }
    }

    Object.assign(windowConfig, dimensions[ IS_DEV ? 'dev' : 'prod' ]);

    const win = new BrowserWindow(windowConfig);

    win.loadFile('./dist/index.html');

    function getActiveWindow() {
        activeWindows().getActiveWindow().then(result => {
            win.webContents.send('app:stateChange:window', {
                windowName: result.windowName
            });
        });
    }

    let pollActiveWindow = setInterval(getActiveWindow, 1000);

    win.on('focus', (e) => {
        win.webContents.send('app:stateChange:focus');
        win.webContents.send('app:stateChange:window', {
            windowName: '__self__'
        });
        clearInterval(pollActiveWindow);
    });

    win.on('blur', (e) => {
        win.webContents.send('app:stateChange:blur');
        getActiveWindow()
        pollActiveWindow = setInterval(getActiveWindow, 1000);
    });

    if (IS_DEV) {
        win.webContents.openDevTools();
    }

    return win;
}

const { saveImage, saveSnapshot, getLatestSnapshot } = require('./io.js');

app.whenReady().then(async () => {
    const win = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    await session.defaultSession.loadExtension(devToolsBath);
    
    const conf = {
        cwd: __dirname,
        logs: app.getPath('logs'),
        appData: app.getPath('appData'),
        userData: app.getPath('userData')
    }

    ipcMain.handle('app:saveImage', saveImage);
    ipcMain.handle('app:saveSnapshot', (e, data) => saveSnapshot(conf.userData, data));
    ipcMain.handle('app:getLatestSnapshot', (e) => getLatestSnapshot(conf.userData));
})