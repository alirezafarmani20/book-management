const http = require('http');
const fs = require('fs');
const url = require('url');
const db = require('../db.json');

// default port
const port = 4000;

const server = http.createServer((req, res) => {
  if (req.method == 'GET' && req.url == '/api/users') {
    // get all users
    fs.readFile('./db.json', (err, db) => {
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
  } else if (req.method == 'GET' && req.url == '/api/books') {
    // get all books
    fs.readFile('./db.json', (err, db) => {
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
  } else if (req.method == 'DELETE' && req.url == '/api/books') {
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
  } else if (req.method == 'POST' && req.url == '/api/books') {
    // add new book
    let book = '';
    req.on('data', (data) => {
      book = book + data.toString();
    });
    req.on('end', () => {
      // console.log(JSON.parse(book));
      const newBook = {
        id: crypto.randomUUID(),
        ...JSON.parse(book),
        free: 1,
      };
      // console.log(newBook)
      db.books.push(newBook);
      fs.writeFile('./db.json', JSON.stringify(db), (err) => {
        if (err) {
          throw err.message;
        } else {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.write(JSON.stringify({ message: 'new book created' }));
          res.end('new book add');
        }
      });
    });
  } else if (req.method == 'PUT' && req.url == '/api/books') {
    // update book
    const parseUrl = url.parse(req.url, true);
    const bookId = parseUrl.query.id;
    let bookNewInfo = '';
    req.on('data', (data) => {
      bookNewInfo = bookNewInfo + data.toString();
    });
    req.on('end', () => {
      const reqBody = JSON.parse(bookNewInfo);
      db.books.forEach((book) => {
        if (book.id == Number(bookId)) {
          book.title = reqBody.title;
          book.author = reqBody.author;
          book.price = reqBody.price;
        }
      });
      fs.writeFile('./db.json', JSON.stringify(db), (err) => {
        if (err) {
          throw err.message;
        } else {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.write(JSON.stringify({ message: 'book updated' }));
          res.end();
        }
      });
    });
  } else if (req.method == 'POST' && req.url == '/api/users') {
    // crete new user
    let user = '';
    req.on('data', (data) => {
      user = user + data.toString();
    });
    req.on('end', () => {
      const { name, username, email } = JSON.parse(user);
      const newUser = {
        id: crypto.randomUUID(),
        name,
        username,
        email,
        crime: 0,
      };
      db.users.push(newUser);
      fs.writeFile('./db.json', JSON.stringify(db), (err) => {
        if (err) {
          throw err.message();
        } else {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.write(JSON.stringify({ message: 'user created' }));
          res.end();
        }
      });
    });
  }
});

server.listen(port, () => {
  // runing server
  console.log(`app is runing on port ${port}`);
});
