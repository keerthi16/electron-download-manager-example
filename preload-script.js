const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const downloadItem = require('./templete.js');

ipcRenderer.on('downloadInProgress', (event, args) => {
    progressHandler(event, args);
});

ipcRenderer.on('downloadCompleted', (event, args) => {
    const completedItem = document.getElementById(`${args.id}`);
    const bar = document.getElementById(`${args.id}-bar`);
    const open = document.getElementById(`${args.id}-open`);
    const close = document.getElementById(`${args.id}-close`);
    const action = document.getElementById(`${args.id}-actions`);
    const main = document.getElementById(`${args.id}-main`);
    const per = document.getElementById(`${args.id}-per`);

    if (action) {
        action.classList.remove('hidden');
    }

    if (per) {
        per.classList.add('hidden');
    }

    if (completedItem) {
        completedItem.innerText = 'Completed';
    }

    if (open) {
        open.addEventListener('click', () => {
            const showResponse = remote.shell.showItemInFolder(args.path);
            if (!showResponse) {
                remote.dialog.showErrorBox('File not found', `File not found in path${args.path}`);
            }
        });
    }

    if (close) {
        close.addEventListener('click', () => {
            main.remove();
        });
    }

    if (bar) {
        bar.innerHTML = null;
    }
});

ipcRenderer.on('downloadStated', (event, args) => {
    createDownloadDOM(event, args);
});

function progressHandler(e, args) {
    const progressBar = document.getElementById(`${args.id}-progress`);
    const per = document.getElementById(`${args.id}-per`);
    if (progressBar) {
        progressBar.max = args.itemTotal;
        progressBar.value = args.received;
        per.innerText = Math.round((args.received / args.itemTotal) * 100) + '%';
    }
}

function createDownloadDOM(e, args) {
    const mainDOM = document.getElementById('main');

    if (mainDOM) {
        mainDOM.innerHTML += downloadItem(args);
    }
}
