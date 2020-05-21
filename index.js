const fs = require('fs'); // file system module. It already comes with node.js
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); // readFileSync is a method from 'fs'.
const laptopData = JSON.parse(json); // parse it into an object

const server = http.createServer((req, res) => { // it's run every time somebody goes to the site and then a callback function asks a request

    const pathName = url.parse(req.url, true).pathname; // where the url is stored
    const id = url.parse(req.url, true).query.id;

    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'})// http header to let the browser know
        res.end('This is the products page');

    } else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'})

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => { // callback function has 2 parameters in this case (error and data)
            let laptop = laptopData[id];
            let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
            output = output.replace(/{%IMAGE%}/g, laptop.image);
            output = output.replace(/{%PRICE%}/g, laptop.price)
            output = output.replace(/{%SCREEN%}/g, laptop.screen)
            output = output.replace(/{%CPU%}/g, laptop.cpu)
            output = output.replace(/{%STORAGE%}/g, laptop.storage)
            output = output.replace(/{%RAM%}/g, laptop.ram)
            output = output.replace(/{%DESCRIPTION%}/g, laptop.description)
            res.end(output); // send response back to the browser
        });

    } else {
        res.writeHead(404, { 'Content-type': 'text/html'})
        res.end('URL was not found on the server');
    }
});

server.listen(8080, '127.0.0.1', () => { // it indicates node.js to always keep listening to a certain port
    console.log('server is listening for requests')
});