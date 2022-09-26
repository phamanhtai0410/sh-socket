const config = require('../../config');

console.debug = function(...args) {
    if (config.debug) {
        console.log.apply(console, args);
    }
};

