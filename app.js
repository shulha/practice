const env = require('./getEnv');
const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 3000;

function getFateTime() {
    return new Date().getTime();
}

function log(req, res) {
    const { remoteAddress, remotePort } = res.socket;

    logFile.write(`${getFateTime()} - ${req.method} to ${req.url} from ${remoteAddress}:${remotePort}\n`);
}

const logFile = fs.createWriteStream('log.txt');
logFile.on('finish', () => console.log(`file has been written`));
process.on('SIGINT', (e) => {
    logFile.write(`${getFateTime()} - ${e}\n`);
    server.close();
});

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
        if (nameURL && fs.existsSync(`${nameURL}.pdf`)) {
            const fileName = `${nameURL}.pdf`;
            const readFile = fs.createReadStream(fileName);

            response.setHeader('Content-Type', 'application/pdf');
            response.statusCode = 200;
            readFile.on('data', data => {
                response.write(data);
            });
            readFile.on('end', () => {
                response.end();
            });
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

server.on('close', function() {
    logFile.end();
});