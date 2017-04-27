const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;
let eventList = [];
const pageURL = 'https://desktop.qa8.vocal-qa.com';

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});

  win.loadURL(pageURL);

  const js = fs.readFileSync('./record.js', {encoding: 'utf8'});
  win.webContents.executeJavaScript(js);

  ipcMain.on('click', (e, path) => {
    eventList.push({
      event: 'click',
      target: path
    });
  });

  ipcMain.on('keydown', (e, keyCode) => {
    eventList.push({
      event: 'keydown',
      char: String.fromCharCode(parseInt(keyCode, 10))
    });
  });

  win.on('closed', () => {
    win = null;
  });
}

function createTestScript() {
  let testString =
`#! /usr/bin/env python

from selenium import webdriver

browser = webdriver.Chrome()
browser.implicitly_wait(10)
browser.get("${pageURL}")
`;
  eventList.forEach((event) => {
    testString += getEventString(event);
  });

  fs.writeFileSync('testScript.py', testString);
}

function getEventString(event) {
  if (event.event === 'click') {
    return `element = browser.find_element_by_css_selector('${event.target}')
element.click()
`;
  } else if (event.event === 'keydown') {
    return `element.send_keys('${event.char}')
`;
  } else {
    return '';
  }
}

app.on('ready', createWindow);
app.on('quit', createTestScript);

