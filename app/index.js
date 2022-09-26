const config = require('./config');
const servers = require('./bin/servers');
const http = require('http');
const router = require('./router');
const express = require('express');
const fns = require('./bin/functions');
const socketio = require('socket.io');
const ioredis = require('socket.io-redis');
const bodyParser = require('body-parser');
const socketController = require('./controller/socket');
const unixModel = require('./models/unix');
const _ = require('lodash');
const fs = require('fs');
const {createAdapter} = require("@socket.io/redis-adapter");
const {Cluster} = require("ioredis");

function startExpress() {
    servers.express = express();

    servers.express.use((bodyParser.json({type: 'application/json', limit: '1mb'})));

    if (config.debug) {
        servers.express.use('/test', express.static(process.cwd() + '/test'));
    }

    servers.express.use(router);
    // servers.express.use(swStats.getMiddleware());
}

function startHttp() {
    servers.http = http.Server(servers.express);
    servers.http.on('request', (req, res) => res.request = req);
    console.log(`Start HTTP !!! ${JSON.stringify(servers)}`)
}

function startSocketIo() {
    servers.socketio = socketio(servers.http, _.merge({}, config.socketio));
    const pubClient = new Cluster(JSON.parse(process.env.REDIS_CLUSTER));

    console.debug('REDIS_CLUSTER', process.env.REDIS_CLUSTER)

    const subClient = pubClient.duplicate();
    servers.socketio.engine.generateId = (req) => {
        var wid = process.id;
        var rid = fns.randomInt();

        if (wid < 10) wid = '0' + wid;
        wid = String(wid);

        return wid + rid.toString(36);
    };

    // servers.socketio.adapter(ioredis(config.redis.pubsub));
    servers.socketio.adapter(createAdapter(pubClient, subClient));

    servers.socketio.on('connection', socketController.connect);
}

function startListener() {
    var unixPath = unixModel.getPath(process.id);

    if (fs.existsSync(unixPath)) {
        fs.unlinkSync(unixPath);
    }

    servers.srv.listen(unixPath, () => {
        // if(unixPath!==8000) {
        fs.chmodSync(unixPath, '777');
        // }
        console.log('The unix server %s has been started', process.id);
    });

    servers.srv.on('connection', sck => servers.http.emit('connection', sck));
}

async function main() {
    startExpress();
    startHttp();
    startSocketIo();
    startListener();
}

module.exports = main;
