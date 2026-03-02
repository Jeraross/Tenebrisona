import { app, BrowserWindow, session } from 'electron';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { isDev } from './util.js';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { registerInvestigationHandlers } from './ipc/investigation.ipc.js';
import { registerLibraryHandlers } from './ipc/library.ipc.js';
import { registerAudioHandlers } from './ipc/audio.ipc.js';
import { registerSpotifyHandlers } from './ipc/spotify.ipc.js';

// Mantemos a referência da janela principal globalmente
let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
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

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Carregamento da Interface 
  if (isDev()) {
    mainWindow.loadURL('http://localhost:6767');
  } else {  
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }

  return mainWindow;
}

// Ciclo de Vida do App
app.whenReady().then(() => {
  // Define o ID do app no Windows
  electronApp.setAppUserModelId('com.tenebrisona');

  // F12 para DevTools e Ctrl+R para recarregar a janela
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Registra todos os manipuladores (Handlers) IPC do Back-end
  registerInvestigationHandlers();
  registerLibraryHandlers();
  registerAudioHandlers();

  // Cria a janela e salva a referência
  const window = createWindow();

  // Registra o handler do Spotify passando a janela recém-criada
  registerSpotifyHandlers(window);

  // Recria a janela no macOS se o app estiver aberto mas sem janelas ativas
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const newWindow = createWindow();
      // Se a janela for recriada, precisamos atrelar o Spotify a ela novamente
      registerSpotifyHandlers(newWindow);
    }
  });
});

// Encerra o processo do Node.js quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});