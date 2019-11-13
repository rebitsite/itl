import configStorage from "./config";
import { reportMissingPhrase, getPack, getSupportedLanguages, setEndpointURL } from "./utils";

type Props = {
    endPoint: string,
    defaultLanguage: string,
    selectedLanuage?: string,
    testMode?: boolean
}

export default class itl {

    private _s: string[] = [];
    private _d: string[] = [];

    private _sCode: string = "en";
    private _dCode: string = "en";

    private ready = false;
    private reportEnabled = true;
    private _testMode = false;
    private _checked = false;
    _unlisted: string[] = [];

    constructor(props: Props) {
        this._dCode = props.defaultLanguage;
        this._testMode = props.testMode || false;
        props.selectedLanuage && (this._sCode = props.selectedLanuage);

        this.loadPack = this.loadPack.bind(this);
        this.text = this.text.bind(this);
        this.setLanguage = this.setLanguage.bind(this);

        setEndpointURL(props.endPoint);

        this.initiate.bind(this)();
    }

    getCode() {
        return this._sCode;
    }

    t = this.text;

    async initiate() {
        let _s = configStorage.get(`lang/selected`);
        let _d = configStorage.get(`lang/default`);

        if (_s && _d) {
            this._s = _s;
            this._d = _d;
            this.ready = true;
        }

        let { _sCode, _dCode } = Object.assign({ _sCode: "en", _dCode: "en" }, configStorage.get("lang/settings"))

        this._sCode = _sCode;
        this._dCode = _dCode;

        // Reload and check if it up-to-date
        await this.loadPack();
    }

    async loadPack() {
        if (this._checked) return;
        this._checked = true;
        let { version } = configStorage.get("lang/settings") || {};

        getPack({
            code: this._sCode,
            defaultCode: this._dCode,
            version
        })
            .then(packs => {
                if (packs) {
                    this._s = packs[this._sCode].phrases;
                    this._d = packs[this._dCode].phrases;

                    configStorage.set(`lang/default`, this._d);
                    configStorage.set(`lang/selected`, this._s);
                    configStorage.set(`lang/settings`, { version: packs.version }, { merge: true });
                }
                this.ready = true;
            })
            .catch(err => {
                this.reportEnabled = false;
                this.ready = true;
            })
    }

    private findInDefault = (lowerCaseValue: string) => {
        return this._d.findIndex(item => {
            return item.toLowerCase() === lowerCaseValue;
        })
    }

    /**
     * Return a list of not-translated phrases as string[]
     */
    getUnlisted() {
        return this._unlisted.filter((phrase, i) => this._unlisted.indexOf(phrase) === i);
    }

    text(phrase: string, opts?: {
        data?: { [prop: string]: any },
        case?: "upper" | "lower" | "capital" | "title",
        format?: string
    }) {
        let index = -1;
        !opts && (opts = {});

        if ((index = this.findInDefault(phrase.toLowerCase())) !== -1) {
            phrase = this._s[index];
        } else if (this.ready && !this.reportEnabled) {
            // report
            reportMissingPhrase({
                phrase,
                code: this._sCode
            })
        }
        if (this._testMode && index === -1) {
            this._unlisted.push(phrase);
        }

        let result = opts.data ? replace(phrase, opts.data) : phrase;
        result && (result = textTransform(result, { case: (opts && opts.case) || "capital" }));
        opts.format && (result = replace(opts.format, { text: result }))
        return result;
    }

    async setLanguage(code: string, opts?: { reload: boolean }) {
        if (code !== this._sCode) {
            let packs = code !== this._dCode ? await getPack({ code }) :
                { [code]: { phrases: this._d } };
            if (!packs) {
                throw Error(this.text(`Language is not supported`));
            }

            if (this._sCode !== this._dCode) {
                configStorage.remove(this._sCode);
            }

            this._sCode = code;
            this._s = packs[code].phrases;

            configStorage.set(`lang/selected`, this._s);
            configStorage.set("lang/settings", { _sCode: code });

            opts && opts.reload && document.location.reload()
        }
    }

    async getSupportedOptions(): Promise<{ value: string, label: string }[]> {
        let list = await getSupportedLanguages() as { data: { [code: string]: string } };
        return Object.keys(list.data).map(value => {
            return { value, label: list.data[value] }
        }).sort((a, b) => a.label.localeCompare(b.label));
    }
}

function replace(html: string, data: any) {
    let re: RegExp;

    Object.keys(data).forEach(prop => {
        re = new RegExp(`__${prop}__`, "g");
        html = html.replace(re, data[prop]);
    })
    return html;
}

function textTransform(result: string, opts: { case: "upper" | "lower" | "capital" | "title" }) {
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