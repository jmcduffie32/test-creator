const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});

  win.loadURL('https://desktop.qa8.vocal-qa.com');

  const js = fs.readFileSync('./record.js', {encoding: 'utf8'});
  win.webContents.executeJavaScript(js);
  ipcMain.on('test', (e, path) => {
    console.log(path);
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);
