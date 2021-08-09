const http = require('http');
const debug = require('debug')('node-angular');
const app = require('./app');
const port = parseInt(process.env.PORT, 10) || 3000;

const getBind = () => {
    const address = server.address();
    return typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
}

const onError = (err) => {
    if (err.syscall !== 'listen') {
        throw err;
    }
    const bind = getBind();
    switch (err.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' already in use');
            process.exit(1);
            break;
        default: {
            throw err;
        }
    }
}

const onListening = () => {
    debug(`Listening on ${getBind()}`)
}

app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);