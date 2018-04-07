'use strict';
const path = require('path');
const electron = require('electron');
const app = electron.app;

const guid = require('./uid');

require('electron-dl')();

let mainWindow;
const preloadScript = path.join(__dirname, '_preloadScript.js');

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1240,
		height: 600,
        webPreferences: {
            preload: preloadScript,
        }
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

    win.webContents.session.on('will-download', (event, item, webContents) => {
        const browserWindow = electron.BrowserWindow.fromWebContents(webContents);
        item.id = guid(); // can be done differently
        browserWindow.webContents.send('downloadStated', {
            itemTotal: item.getTotalBytes(),
            received: item.getReceivedBytes(),
            name: item.getFilename(),
            path: item.getSavePath(),
            id: item.id,
        });
        item.on('updated', (event, state) => {
            if (browserWindow.isDestroyed()) {
                return;
            }
            if (state === 'interrupted') {
                // interrupted
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    // handle pause
                } else {
                    browserWindow.webContents.send('downloadInProgress', {
                        itemTotal: item.getTotalBytes(),
                        received: item.getReceivedBytes(),
                        name: item.getFilename(),
                        path: item.getSavePath(),
                        id: item.id,
                    });
                }
            }
        });
        item.once('done', (event, state) => {
            if (browserWindow.isDestroyed()) {
                return;
            }
            if (state === 'completed') {
                browserWindow.webContents.send('downloadCompleted', {
                    itemTotal: item.getTotalBytes(),
                    received: item.getReceivedBytes(),
                    name: item.getFilename(),
                    path: item.getSavePath(),
                    id: item.id,
                });
            } else {
                // handle
            }
        })
    });

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
