const http = require('http');
const fs = require('fs');

// default port
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method == 'GET' || req.url == '/api/users') {
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
  } else if (req.method == 'GET' || req.url == '/api/books') {
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
  }
});

server.listen(port, () => {
  console.log(`app is runing on port ${port}`);
});
