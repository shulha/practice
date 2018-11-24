const env = require('./getEnv');
const http = require('http');
const url = require('url');

const PORT = 3000;

function getFateTime() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

}

function log(req, res) {
    const { remoteAddress, remotePort } = res.socket;
    const parsedURL = url.parse(req.url);
    //дату и время запроса, метод, URL, параметры запроса, ip-адрес
    console.log(`${getFateTime()} - ${req.method} to ${parsedURL.pathname} with ${parsedURL.query} from ${remoteAddress}:${remotePort}`);
}

const server = http.createServer((request, response) => {
    const splitURL = url.parse(request.url).pathname.split('/');
    const baseURL = splitURL[1];
    const nameURL = splitURL[2];

    log(request, response);

    if (baseURL === 'variables') {
        if (nameURL) {
            const envJSON = JSON.parse(env);
            const envValue = envJSON[nameURL];

            if (envValue) {
                response.writeHead(200,{'Content-Type' : 'text/plain'});
                response.end(envValue);
            } else {
                response.writeHead(404,{'Content-Type' : 'text/plain'});
                response.end('Not found');
            }
        } else {
            response.writeHead(200,{'Content-Type' : 'application/json'});
            response.end(env);
        }
    } else if (baseURL === 'files') {
        if (nameURL) {
            // response.setHeader('Content-Type', 'application/pdf');
            response.statusCode = 200;
            response.end(nameURL + ' file');
        } else {
            response.writeHead(404,{'Content-Type' : 'text/plain'});
            response.end('Not found');
        }
    } else {
        response.writeHead(400,{'Content-Type' : 'text/plain'});
        response.end('Bad request');
    }
});

server.listen(PORT, err => {
    if (err) {
        return console.log(`Something went wrong: ${err}`);
    }

    console.log(`Server is running on port ${PORT}`);
});
