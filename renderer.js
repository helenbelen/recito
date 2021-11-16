
document.getElementById('searchButton').onclick = (event) => {
    let search = document.getElementById('searchBox').value
    window.electron.runBooks(search)
}


