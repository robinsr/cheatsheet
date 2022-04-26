const { app, BrowserWindow, dialog, ipcMain, ipcRenderer } = require('electron');
const path = require('path');

const IS_DEV = process.env.ELECTRON_DEV === 'true';

const { saveImage } = require('./src/main/io');

const dimensions = {
    dev: {
        width: 2000, height: 1600
    },
    prod: {
        width: 500, height: 1050
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
            preload: path.resolve(__dirname, 'src/main/preload.js')
        }
    }

    Object.assign(windowConfig, dimensions[ IS_DEV ? 'dev' : 'prod' ]);

    const win = new BrowserWindow(windowConfig);

    win.loadFile('dist/index.html')

    win.on('focus', (e) => {
        console.log('Focused');
        win.webContents.send('app:stateChange', 'focus');
    });

    win.on('blur', (e) => {
        console.log('Lost focus');
        win.webContents.send('app:stateChange', 'blur');
    });

    if (IS_DEV) {
        win.webContents.openDevTools();
    }

    return win;
}



app.whenReady().then(() => {
    const win = createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    
    const electron_conf = {
        cwd: __dirname,
        logs: app.getPath('logs'),
        appData: app.getPath('appData'),
        userData: app.getPath('userData')
    }

    ipcMain.handle('app:dialog:saveImage', saveImage);
})