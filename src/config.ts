function get(key: string): any {
    let value = localStorage.getItem(key);

    if (value) {
        let data = JSON.parse(value);
        return data.data;
    }

    return undefined;
}

function set(key: string, data: any, opts?: { merge: boolean }) {

    if (opts && opts.merge) {
        data = Object.assign({}, get(key), data);
    }

    localStorage.setItem(key, JSON.stringify({ data }));
}

function remove(key: string) {
    localStorage.removeItem(key);
}

const configStorage = { get, set, remove };

export default configStorage;