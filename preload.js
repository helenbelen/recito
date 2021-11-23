const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld(
    'electron',
    {
        runBooks: (searchTerm) => ipcRenderer.send('runBooksApi', searchTerm)
    }
)

ipcRenderer.on('sendBooksApiResponse', (event, arg) => {
    let json = JSON.parse(arg.toString())
    let results = json.items
    let list = document.getElementById("resultList");
    list.innerHTML = ''
    results.forEach((result)=>{
        let li = document.createElement("li");
        li.innerText = result["volumeInfo"]["title"] + " by " + result["volumeInfo"]["authors"];
        list.appendChild(li);
    })
    document.getElementById('results').innerText = json.totalItems + " Results Found."
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
