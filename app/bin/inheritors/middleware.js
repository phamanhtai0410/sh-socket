
/**
 * Make the function would call handler function before
 * @param {Function} handler 
 * @param {*} thisObj
 * @returns {Function}
 */
function middleware(handler, thisObj) {
    return async function(...args) {
        return await (await handler(this)).apply(thisObj, args);
    }.bind(this);
}

Function.prototype.$ =
    Function.prototype.middleware = middleware;

