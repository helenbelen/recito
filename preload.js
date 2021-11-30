const {contextBridge, ipcRenderer} = require('electron')
const { Pool } = require('pg');
let pool = null
contextBridge.exposeInMainWorld(
    'electron',
    {
        runBooks: (searchTerm) => ipcRenderer.send('runBooksApi', searchTerm),
        dbPool: () => {
            if (!pool) {
                pool = new Pool({
                    user: 'postgres',
                    host: '127.0.0.1',
                    database: 'postgres',
                    password: 'postgres',
                    port: 5432,
                })
            }
            return pool;
        }
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
