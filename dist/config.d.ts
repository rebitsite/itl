declare function get(key: string): any;
declare function set(key: string, data: any, opts?: {
    merge: boolean;
}): void;
declare function remove(key: string): void;
declare const configStorage: {
    get: typeof get;
    set: typeof set;
    remove: typeof remove;
};
export default configStorage;
