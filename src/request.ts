
type Request = {
    method: "POST" | "GET" | "PATCH" | "DELETE",
    url: string,
    data?: any
}

export function createRequest(args: Request) {

    let opts: any = { method: args.method };
    args.data && (opts.data = JSON.stringify(args.data));

    return new Promise((resolve: any, reject:any) => {
        fetch(opts.url, opts)
        .then(rs => rs.json())
        .then(resolve)
        .catch(reject);
    })
}