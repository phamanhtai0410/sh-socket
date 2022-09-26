
class HttpResponse {
    constructor(arr) {
        this.status = Number(arr[0]);
        if (!this.status) throw new TypeError('Invalid status code '+ this.status);

        this.data = arr[1];
        this.headers = arr[2];
    }
}

Object.defineProperty(Array.prototype, 'http', {
    get() {
        return new HttpResponse(this);
    }
});

module.exports = HttpResponse;
