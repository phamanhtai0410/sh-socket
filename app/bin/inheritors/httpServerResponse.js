const ServerResponse = require('http').ServerResponse;
const consts = require('../../consts');

ServerResponse.prototype.writeHead = (o=> function(...args) {
    this.setHeader('x-powered-by', consts.APP_FULL_NAME);
    this.setHeader('Access-Control-Allow-Origin', '*');
    this.setHeader('x-pid', process.id);
    // this.setHeader('connection', 'close');

    return o.apply(this, args);

})(ServerResponse.prototype.writeHead);

