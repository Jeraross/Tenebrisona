import { app, BrowserWindow, session } from 'electron';
import path from 'path';
import { isDev } from './util.js';

app.on('ready', () => {
  if (!isDev()) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"],
        },
      });
    });
  }

  const mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:6767');
  } else {  
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }
});