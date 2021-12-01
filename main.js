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
        let message = ""
        response.on('data', chunk => {
            message  = message + chunk.toString()
        })
        response.on('end', () => {
            event.reply('sendBooksApiResponse', message)
        })
    })
}

ipcMain.on('addBooksToList', (event, arg) => {
    event.reply('updateUserBookList', message).then(_ => console.log(`Added Books: ${arg}`))
})

ipcMain.on('runBooksApi', (event, arg) => {
    queryBooks(event, arg).then(_ => console.log(`search for '${arg}' complete`))
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


