"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createRequest(args) {
    let opts = { method: args.method };
    args.data && (opts.data = JSON.stringify(args.data));
    return new Promise((resolve, reject) => {
        fetch(args.url, opts)
            .then(rs => rs.json())
            .then(resolve)
            .catch(reject);
    });
}
exports.createRequest = createRequest;
