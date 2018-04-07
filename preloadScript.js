const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const downloadItem = require('./templete.js');

ipcRenderer.on('downloadInProgress', (event, args) => {
    progressHandler(event, args);
});

ipcRenderer.on('downloadCompleted', (event, args) => {
    let completedItem = document.getElementById(`${args.id}`);
    let bar = document.getElementById(`${args.id}-bar`);
    let open = document.getElementById(`${args.id}-open`);
    let close = document.getElementById(`${args.id}-close`);
    let action = document.getElementById(`${args.id}-actions`);
    let main = document.getElementById(`${args.id}-main`);
    let per = document.getElementById(`${args.id}-per`);

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
            let showResponse = remote.shell.showItemInFolder(args.path);
            if (!showResponse) {
                remote.dialog.showErrorBox("File not found", `File not found in path${args.path}`);
            }
        })
    }

    if (close) {
        close.addEventListener('click', () => {
            main.remove();
        })
    }

    if (bar) {
        bar.innerHTML = null;
    }
});

ipcRenderer.on('downloadStated', (event, args) => {
    createDownloadDOM(event, args);
});

function progressHandler(e, args) {
    let progressBar = document.getElementById(`${args.id}-progress`);
    let per = document.getElementById(`${args.id}-per`);
    if (progressBar) {
        progressBar.max = args.itemTotal;
        progressBar.value = args.received;
        per.innerText = Math.round((args.received / args.itemTotal) * 100) + "%"
    }
}

function createDownloadDOM(e, args) {
    let mainDOM = document.getElementById('main');

    if (mainDOM) {
        mainDOM.innerHTML += downloadItem(args);
    }
}
