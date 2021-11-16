const { app, BrowserWindow, net, ipcMain} = require('electron')
const path = require('path')
const https = require("https");

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            sandbox: false
        }
    })

    win.loadFile('index.html')
}

async function queryBooks (event, term) {
    await https.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${term}&key=${process.env.API_KEY}`, (response) => {
        response.on('data', chunk => {
            event.reply('sendBooksApiResponse', chunk.toString())
        })
    })
}

ipcMain.on('runBooksApi', (event, arg) => {
    queryBooks(event, arg).then(r => console.log(`search for '${arg}' complete`))
})

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})


