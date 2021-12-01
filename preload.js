const {contextBridge, ipcRenderer} = require('electron')
const { Pool } = require('pg');

let pool = null
contextBridge.exposeInMainWorld(
    'electron',
    {
        runBooks: (searchTerm) => ipcRenderer.send('runBooksApi', searchTerm),
        refreshList: () => refreshBookList(),
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

const INSERT_BOOK_QUERY = (links) => {
    let query = "INSERT INTO book_list (user_id, self_link) values";
    links.forEach((link) => {
        query = query + `('1', '${link}'),`
    })
    query = query.substring(0, query.length - 1);
    query = query + " returning id;"
    return query;
}

function insertBooks() {
    let checkboxes = document.getElementsByName("bookResult");
    let links = [];
    console.log(checkboxes)
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            links.push(checkbox.value);
        }
    })
    let insertQuery = INSERT_BOOK_QUERY(links);
    if (pool) {
        pool.query(insertQuery, (err, res) => {
            if (err) {
                throw err
            }
            console.log(res["rowCount"])
            ipcRenderer.send('addBooksToList', links)
        })

    }
}

function refreshBookList() {

}

ipcRenderer.on("updateUserBookList", (_, _) => {
    refreshBookList()
})

ipcRenderer.on('sendBooksApiResponse', (event, arg) => {
    let json = JSON.parse(arg.toString())
    let results = json.items
    let list = document.getElementById("resultList");
    list.innerHTML = ''
    let dl = document.createElement("dl");
    results.forEach((result)=>{
        let dt = document.createElement("dt");
        let input = document.createElement("input");
        let label = document.createElement("label")
        input.type = "checkbox"
        input.id = result["id"]
        input.name = "bookResult"
        input.value = result["selfLink"]
        label.setAttribute("for", result["id"])
        label.innerText = result["volumeInfo"]["title"] + " by " + result["volumeInfo"]["authors"];
        dt.appendChild(input);
        dt.appendChild(label);
        dl.appendChild(dt);
    })
    let button = document.createElement("input")
    button.type = "submit"
    button.id = "submitButton"
    button.value = "Add To Book List"
    list.appendChild(dl);
    list.appendChild(button);
    button.onclick = (event) => {
        insertBooks();
    }
    document.getElementById('results').innerText = json.totalItems + " Results Found."
})
