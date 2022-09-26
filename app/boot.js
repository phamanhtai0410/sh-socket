require('./bin/inheritors/console');
require('./bin/inheritors/middleware');
require('./bin/inheritors/httpResArray');
require('./bin/inheritors/httpServerResponse');
require('./bin/inheritors/redis');

const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const config = require('./config');

function initDirs() {
    function mkdirNE(p) {
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }

    mkdirNE(path.join(process.cwd(), 'app/unix'));
    mkdirNE(path.join(process.cwd(), 'log'));
}

function initVars() {
    process.id = process.env.NODE_APP_INSTANCE || 0;
}

module.exports = (function() {
    initDirs();
    initVars();

})();
