const fs = require('fs'); // file system module. It already comes with node.js
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); // readFileSync is a method from 'fs'.
const laptopData = JSON.parse(json); // parse it into an object

const server = http.createServer((req, res) => { // it's run every time somebody goes to the site and then a callback function asks a request

    const pathName = url.parse(req.url, true).pathname; // where the url is stored
    const id = url.parse(req.url, true).query.id;

    // PRODUCTS OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'})// http header to let the browser know

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

                const cardsOutput = laptopData.map(item => replaceTemplate(data, item)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });

    //LAPTOP OVERVIEW
    } else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'})

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => { // callback function has 2 parameters in this case (error and data)
            let laptop = laptopData[id];
            let output = replaceTemplate(data, laptop)
            res.end(output); // send response back to the browser
        });

    // IMAGES
    } else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) { // regular expression to test if pathName contains jpg, jpeg and so on
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'img.jpg'});
            res.end(data);
        })

    //URL NOT FOUND
    } else {
        res.writeHead(404, { 'Content-type': 'text/html'})
        res.end('URL was not found on the server');
    }
});

server.listen(8080, '127.0.0.1', () => { // it indicates node.js to always keep listening to a certain port
    console.log('server is listening for requests')
});

function replaceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price)
    output = output.replace(/{%SCREEN%}/g, laptop.screen)
    output = output.replace(/{%CPU%}/g, laptop.cpu)
    output = output.replace(/{%STORAGE%}/g, laptop.storage)
    output = output.replace(/{%RAM%}/g, laptop.ram)
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description)
    output = output.replace(/{%ID%}/g, laptop.id)
    return output;
}