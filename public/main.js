const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;
let imageWindow;
let settingsWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680, webPreferences: { webSecurity: false}});
  imageWindow = new BrowserWindow({width: 600, height: 600, parent: mainWindow, show: false});
  settingsWindow = new BrowserWindow({width: 600, height: 600, parent: mainWindow, show: false});

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  imageWindow.loadURL(isDev ? 'http://localhost:3000/image' : `file://${path.join(__dirname, '../build/index.html')}`);
  settingsWindow.loadURL(isDev ? 'http://localhost:3000/settings' : `file://${path.join(__dirname, '../build/index.html')}`);


  mainWindow.on('closed', () => mainWindow = null);

  imageWindow.on('close', (e) => {
    e.preventDefault();
    imageWindow.hide();
  });

  settingsWindow.on('close', (e) => {
    e.preventDefault();
    settingsWindow.hide();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('toggle-image', (event, arg) => {
  imageWindow.show();
  imageWindow.webContents.send('image', arg);
})


ipcMain.on('toggle-settings', () => {
  settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show();
})
