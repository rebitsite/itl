"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
let _endpoint = "";
function setEndpointURL(url) {
    _endpoint = url;
}
exports.setEndpointURL = setEndpointURL;
function reportMissingPhrase(opts) {
    request_1.createRequest({
        method: "POST",
        url: pathJoin(_endpoint, 'report'),
        data: opts
    });
}
exports.reportMissingPhrase = reportMissingPhrase;
function getPack(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let { code, defaultCode, version } = opts;
        let res = yield request_1.createRequest({
            method: "GET",
            url: pathJoin(_endpoint, `${code}${defaultCode ? ',' + defaultCode : ''}` +
                (version ? `?version=${version}` : '')),
        });
        return res.data;
    });
}
exports.getPack = getPack;
function getSupportedLanguages() {
    return request_1.createRequest({
        method: "GET",
        url: pathJoin(_endpoint, 'list')
    });
}
exports.getSupportedLanguages = getSupportedLanguages;
function pathJoin(...args) {
    return Array.from(args).join("/");
}
