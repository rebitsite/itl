"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get(key) {
    let value = localStorage.getItem(key);
    if (value) {
        let data = JSON.parse(value);
        return data.data;
    }
    return undefined;
}
function set(key, data, opts) {
    if (opts && opts.merge) {
        data = Object.assign({}, get(key), data);
    }
    localStorage.setItem(key, JSON.stringify({ data }));
}
function remove(key) {
    localStorage.removeItem(key);
}
const configStorage = { get, set, remove };
exports.default = configStorage;
