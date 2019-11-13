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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const utils_1 = require("./utils");
class itl {
    constructor(props) {
        this._s = [];
        this._d = [];
        this._sCode = "en";
        this._dCode = "en";
        this.ready = false;
        this.reportEnabled = true;
        this._testMode = false;
        this._checked = false;
        this._unlisted = [];
        this.t = this.text;
        this.findInDefault = (lowerCaseValue) => {
            return this._d.findIndex(item => {
                return item.toLowerCase() === lowerCaseValue;
            });
        };
        this._dCode = props.defaultLanguage;
        this._testMode = props.testMode || false;
        props.selectedLanuage && (this._sCode = props.selectedLanuage);
        this.loadPack = this.loadPack.bind(this);
        this.text = this.text.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        utils_1.setEndpointURL(props.endPoint);
        this.initiate.bind(this)();
    }
    getCode() {
        return this._sCode;
    }
    initiate() {
        return __awaiter(this, void 0, void 0, function* () {
            let _s = config_1.default.get(`lang/selected`);
            let _d = config_1.default.get(`lang/default`);
            if (_s && _d) {
                this._s = _s;
                this._d = _d;
                this.ready = true;
            }
            let { _sCode, _dCode } = Object.assign({ _sCode: "en", _dCode: "en" }, config_1.default.get("lang/settings"));
            this._sCode = _sCode;
            this._dCode = _dCode;
            yield this.loadPack();
        });
    }
    loadPack() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._checked)
                return;
            this._checked = true;
            let { version } = config_1.default.get("lang/settings") || {};
            utils_1.getPack({
                code: this._sCode,
                defaultCode: this._dCode,
                version
            })
                .then(packs => {
                if (packs) {
                    this._s = packs[this._sCode].phrases;
                    this._d = packs[this._dCode].phrases;
                    config_1.default.set(`lang/default`, this._d);
                    config_1.default.set(`lang/selected`, this._s);
                    config_1.default.set(`lang/settings`, { version: packs.version }, { merge: true });
                }
                this.ready = true;
            })
                .catch(err => {
                this.reportEnabled = false;
                this.ready = true;
            });
        });
    }
    getUnlisted() {
        return this._unlisted.filter((phrase, i) => this._unlisted.indexOf(phrase) === i);
    }
    text(phrase, opts) {
        let index = -1;
        !opts && (opts = {});
        if ((index = this.findInDefault(phrase.toLowerCase())) !== -1) {
            phrase = this._s[index];
        }
        else if (this.ready && !this.reportEnabled) {
            utils_1.reportMissingPhrase({
                phrase,
                code: this._sCode
            });
        }
        if (this._testMode && index === -1) {
            this._unlisted.push(phrase);
        }
        let result = opts.data ? replace(phrase, opts.data) : phrase;
        result && (result = textTransform(result, { case: (opts && opts.case) || "capital" }));
        opts.format && (result = replace(opts.format, { text: result }));
        return result;
    }
    setLanguage(code, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (code !== this._sCode) {
                let packs = code !== this._dCode ? yield utils_1.getPack({ code }) :
                    { [code]: { phrases: this._d } };
                if (!packs) {
                    throw Error(this.text(`Language is not supported`));
                }
                if (this._sCode !== this._dCode) {
                    config_1.default.remove(this._sCode);
                }
                this._sCode = code;
                this._s = packs[code].phrases;
                config_1.default.set(`lang/selected`, this._s);
                config_1.default.set("lang/settings", { _sCode: code });
                opts && opts.reload && document.location.reload();
            }
        });
    }
    getSupportedOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            let list = yield utils_1.getSupportedLanguages();
            return Object.keys(list.data).map(value => {
                return { value, label: list.data[value] };
            }).sort((a, b) => a.label.localeCompare(b.label));
        });
    }
}
exports.default = itl;
function replace(html, data) {
    let re;
    Object.keys(data).forEach(prop => {
        re = new RegExp(`__${prop}__`, "g");
        html = html.replace(re, data[prop]);
    });
    return html;
}
function textTransform(result, opts) {
    switch (opts.case) {
        case "upper":
            result = result.toUpperCase();
            break;
        case "lower":
            result = result.toLowerCase();
            break;
        case "title":
            result = result.replace(/\b([a-z])/g, function (_, initial) {
                return initial.toUpperCase();
            });
            break;
        case "capital":
            result = result.replace(result[0], result[0].toUpperCase());
            break;
    }
    return result;
}
