-- Creation of user table
CREATE TABLE IF NOT EXISTS book_list_user (
    user_id INT NOT NULL,
    name varchar(250) NOT NULL,
    PRIMARY KEY (user_id)
);

-- Creation of book_list table
CREATE TABLE IF NOT EXISTS book_list (
    id serial PRIMARY KEY,
    user_id INT NOT NULL,
    self_link text NOT NULL
);

CREATE INDEX book_list_user_index ON book_list (user_id);
