const env = require('./getEnv');
const http = require('http');

const PORT = 3000;

const server = http.createServer((request, response) => {
    const { remoteAddress, remotePort } = response.socket;
    console.log(`Requested ${request.method} ${request.url} from ${remoteAddress}:${remotePort}`);

    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 201;
    response.end(env);
});

server.listen(PORT, err => {
    if (err) {
        return console.log(`Something went wrong: ${err}`);
    }

    console.log(`Server is running on port ${PORT}`);
});
