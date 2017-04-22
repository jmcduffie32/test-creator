const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});

  win.loadURL('https://desktop.qa8.vocal-qa.com');

  win.webContents.executeJavaScript(`const {ipcRenderer} = require('electron');`);
  win.webContents.executeJavaScript(`document.addEventListener('click', (e) => {

var rightArrowParents = [],
    elm,
    entry;

for (elm = e.target; elm; elm = elm.parentNode) {
    entry = elm.tagName.toLowerCase();
    if (entry === "html") {
        break;
    }
    if (elm.className) {
        elm.className = elm.className.replace(/ng-\w*/,'');
        entry += "." + elm.className.replace(/ /g, '.');
    }
    rightArrowParents.push(entry);
}
rightArrowParents.reverse();

ipcRenderer.send('test', rightArrowParents.join(' '));
})`);

  ipcMain.on('test', (e, ar) => {
    console.log(ar);
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);
