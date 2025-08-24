const http = require('http');
const fs = require('fs');
const url = require('url');
const db = require('../db.json');
const { json } = require('stream/consumers');

console.log(db);
// default port
const port = 4000;

const server = http.createServer((req, res) => {
  if (req.method == 'GET' || req.url == '/api/users') {
    // get all users
    fs.readFile('../db.json', (err, db) => {
      if (err) {
        throw err;
      } else {
        console.log('success');
        const data = JSON.parse(db);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.write(JSON.stringify(data.users));
        res.end();
      }
    });
  } else if (req.method == 'GET' || req.url == '/api/books') {
    // get all books
    fs.readFile('../db.json', (err, db) => {
      if (err) {
        throw err;
      } else {
        console.log('succes');
        const data = JSON.parse(db);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.write(JSON.stringify(data.books));
        res.end();
      }
    });
  } else if (req.method == 'DELETE') {
    // delete book
    const parsUrl = url.parse(req.url, true);
    console.log(parsUrl.query.id);
    const bookId = parsUrl.query.id;
    const newBooks = db.books.filter((book) => book.id != bookId);
    fs.writeFile(
      './db.json',
      JSON.stringify({ ...db, books: newBooks }),
      (err) => {
        throw err;
      },
      res.writeHead(200, { 'content-type': 'application/json' }),
      res.write(JSON.stringify({ message: 'book removed!' })),
      res.end()
    );
  }
});

server.listen(port, () => {
  // runing server
  console.log(`app is runing on port ${port}`);
});
