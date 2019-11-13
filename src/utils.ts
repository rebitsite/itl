import { createRequest } from "./request";

type LanguagePack = {
    name: string,
    phrases: string[]
}

let _endpoint: string = "";
export function setEndpointURL(url: string) {
    _endpoint = url;
}

export function reportMissingPhrase(opts: { code: string, phrase: string }) {
    createRequest({
        method: "POST",
        url: pathJoin(_endpoint, 'report'),
        data: opts
    })
}

export async function getPack(opts: {
    code: string,
    defaultCode?: string,
    version?: string
}): Promise<{ [code: string]: LanguagePack } | undefined> {
    let { code, defaultCode, version } = opts;
    let res = await createRequest({
        method: "GET",
        url: pathJoin(
            _endpoint,
            `${code}${defaultCode ? ',' + defaultCode : ''}` +
            (version ? `?version=${version}` : '')
        ),
    }) as { status: string, error?: string, data: { [code: string]: LanguagePack } };
    return res.data;
}

export function getSupportedLanguages() {
    return createRequest({
        method: "GET",
        url: pathJoin(_endpoint, 'list')
    })
}

function pathJoin(...args: any[]) {
    return Array.from(args).join("/")
}