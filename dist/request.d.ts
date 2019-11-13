declare type Request = {
    method: "POST" | "GET" | "PATCH" | "DELETE";
    url: string;
    data?: any;
};
export declare function createRequest(args: Request): Promise<unknown>;
export {};
