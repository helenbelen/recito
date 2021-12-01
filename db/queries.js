export const INSERT_BOOK_QUERY = (links) => {
    let query = "INSERT INTO book_list (user_id, self_link) values";
    links.forEach((link) => {
        query = query + `('1', '${link}'),`
    })
    query = query.substring(0, query.length - 1);
    query = query + " returning id;"
    return query;
}