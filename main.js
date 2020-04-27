const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const menuTemplate = require('./src/utils/menuTemplate');
const AppWindow = require('./src/AppWindow');

let mainWindow = null;
let settingsWindow = null;

app.on('ready', () => {
  const MainWindowConfig = {
    width: 1200,
    height: 800,
  };
  
  const URL = isDev ? 'http://localhost:3000' : 'http://tbd.com';
  mainWindow = new AppWindow(MainWindowConfig, URL);
  mainWindow.on('closed', () => {
    mainWindow = null
  });

  ipcMain.on('open-settings-window', () => {
    const SettingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow,
    };

    const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`;
    settingsWindow = new AppWindow(SettingsWindowConfig, settingsFileLocation);

    settingsWindow.on('closed', () => {
      settingsWindow = null;
    });
  });

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
