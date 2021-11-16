const {contextBridge, ipcRenderer} = require('electron')
const Buffer = require("buffer");

contextBridge.exposeInMainWorld(
    'electron',
    {
        runBooks: (searchTerm) => ipcRenderer.send('runBooksApi', searchTerm),
        myPromises: [Promise.resolve(), Promise.reject(new Error('whoops'))],
        anAsyncFunction: async () => alert(123),
        data: {
            myFlags: ['a', 'b', 'c'],
            bootTime: 1234
        },
        nestedAPI: {
            evenDeeper: {
                youCanDoThisAsMuchAsYouWant: {
                    fn: () => ({
                        returnData: 123
                    })
                }
            }
        }
    }
)

ipcRenderer.on('sendBooksApiResponse', (event, arg) => {
    document.getElementById('results').innerText = arg
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})
