const { app, BrowserWindow } = require('electron');
const http = require('http');

require('../server');

const PORT = process.env.PORT || 3000;

function waitServer() {
    return new Promise(resolve => {
        const checkServer = () => {
            http.get(`http://127.0.0.1:${PORT}`, () => {
                resolve();
            }).on('error', () => {
                setTimeout(checkServer, 500);
            });
        };
        checkServer();
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadURL(`http://127.0.0.1:${PORT}`);
}

app.whenReady().then(async () => {
    await waitServer();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});