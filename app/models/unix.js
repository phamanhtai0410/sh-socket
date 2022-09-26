const path = require('path');

function getPath(wid) {
    if (wid < 10) wid = '0' + wid;
    return path.join(process.cwd(), '/app/unix/' + wid);
}

module.exports = {
    getPath
}
