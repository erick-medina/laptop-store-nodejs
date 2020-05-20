const fs = require('fs'); // file system module. It already comes with node.js
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); // readFileSync is a method from 'fs'.
const laptopData = JSON.parse(json); // parse it into an object

const server = http.createServer((req, res) => { // it's runned everytime somebody goes to the site and then a callback function asks a request

    const pathName = url.parse(req.url, true).pathname; // where the url is stored
    const id = url.parse(req.url, true).query.id;

    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'})// http header to let the browser know
        res.end('This is the products page');
    } else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'})
        res.end(`This is the laptop page for laptop ${id}`);
    } else {
        res.writeHead(404, { 'Content-type': 'text/html'})
        res.end('URL was not found on the server');
    }
});

server.listen(8080, '127.0.0.1', () => { // it indicates node.js to always keep listening to a certain port
    console.log('server is listening for requests')
});