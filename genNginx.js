// const CORES = require('os').cpus().length;
const CORES = 1;
const KEEPALIVE = CORES * 32;
const SERVER_NAME = '127.0.0.1';
const PORT = 443;
const SSL = false;
// const SSL_CRT = process.cwd() + '/keys/ssl.crt';
// const SSL_KEY = process.cwd() + '/keys/ssl.decrypted.key';
const TIMEOUT = Math.round(require('./app/config').socketio.pingInterval / 1000) + 10;

(function main() {
    const _ = require('lodash');
    const fs = require('fs');

    var compiled = _.template(fs.readFileSync(process.cwd() + '/nginx/template.conf'));

    var nginx = compiled({
        path: process.cwd(),
        cores: CORES,
        keepalive: KEEPALIVE,
        serverName: SERVER_NAME,
        port: PORT,
        ssl: SSL,
        sslCert: null,
        sslKey: null,
        timeout: TIMEOUT
    });

    fs.writeFileSync(process.cwd() + '/nginx.conf', nginx);
})();
