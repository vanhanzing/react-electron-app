const { app, BrowserWindow, session, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
let browserWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(
    app.isPackaged
      ? `file://${path.join(__dirname, '../build/index.html')}`
      : 'http://localhost:3000'
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create the application menu with Edit and View options
  const menu = Menu.buildFromTemplate([
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator:
            process.platform === 'darwin' ? 'Command+Option+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
        {
          label: 'Clear Browser Data',
          click: async () => {
            await clearBrowserData();
            console.log('Browser data cleared.');
            mainWindow.webContents.send('clear-data', {
              message: 'Browser data has been cleared.',
            });
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

// Function to clear all browser data (cookies, cache, and storage)
async function clearBrowserData() {
  try {
    await session.defaultSession.clearStorageData({
      storages: [
        'cookies',
        'localstorage',
        'caches',
        'indexdb',
        'serviceworkers',
      ],
      quotas: ['temporary', 'persistent', 'syncable'],
    });
    console.log('All browser data cleared successfully.');
  } catch (error) {
    console.error('Error clearing browser data:', error);
  }
}

// Function to create and open the Instagram login page
function createBrowserWindow() {
  if (!mainWindow) return;

  browserWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  browserWindow.loadURL('https://www.instagram.com/accounts/login/');

  const filter = { urls: ['https://www.instagram.com/api/graphql/'] };

  session.defaultSession.webRequest.onCompleted(filter, async (details) => {
    console.log('Intercepted request to GraphQL endpoint');

    const cookieNames = [
      'sessionid',
      'csrftoken',
      'mid',
      'ig_did',
      'ds_user_id',
    ];
    const cookieData = {};

    for (const name of cookieNames) {
      try {
        const [cookie] = await session.defaultSession.cookies.get({
          url: 'https://www.instagram.com',
          name,
        });
        cookieData[name] = cookie ? cookie.value : 'Not available';
      } catch (error) {
        console.error(`Error retrieving cookie "${name}":`, error);
        cookieData[name] = 'Not available';
      }
    }

    mainWindow.webContents.send('session-data', {
      sessionData: cookieData,
      timestamp: new Date().toISOString(),
    });

    console.log(
      'Extracted Cookie Data in JSON:',
      JSON.stringify(cookieData, null, 2)
    );

    if (browserWindow) {
      console.log('Closing Instagram login page after capturing cookies.');
      browserWindow.close();
    }
  });

  browserWindow.on('closed', () => {
    browserWindow = null;
  });
}

// Listen for 'open-browser' event from React to create the Instagram browser window
ipcMain.on('open-browser', createBrowserWindow);

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
