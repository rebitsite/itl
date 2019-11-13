declare type LanguagePack = {
    name: string;
    phrases: string[];
};
export declare function setEndpointURL(url: string): void;
export declare function reportMissingPhrase(opts: {
    code: string;
    phrase: string;
}): void;
export declare function getPack(opts: {
    code: string;
    defaultCode?: string;
    version?: string;
}): Promise<{
    [code: string]: LanguagePack;
} | undefined>;
export declare function getSupportedLanguages(): Promise<unknown>;
export {};
