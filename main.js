const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const URL = isDev ? 'http://localhost:3000' : 'http://tbd.com';
  mainWindow.loadURL(URL);
});
