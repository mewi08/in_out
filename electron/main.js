require('dotenv').config();
const { app, BrowserWindow } = require('electron');
require('../server');

const PORT = process.env.PORT || 3000;
function waitServer(){
    return new Promise(resolve =>{
        const interval = setInterval(() => {
            if( global.serverReady){
                clearInterval(interval);
                resolve();
            }
        }, 100);
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

    win.loadURL(`http://localhost:${PORT}`);
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