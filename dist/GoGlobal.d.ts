declare type GoGlobalProps = {
    endPoint: string;
    defaultLanguage: string;
    selectedLanuage?: string;
    testMode?: boolean;
};
export declare class GoGlobal {
    private _s;
    private _d;
    private _sCode;
    private _dCode;
    private ready;
    private reportEnabled;
    private _testMode;
    private _checked;
    _unlisted: string[];
    constructor(props: GoGlobalProps);
    getCode(): string;
    initiate(): Promise<void>;
    loadPack(): Promise<void>;
    private findInDefault;
    getUnlisted(): string[];
    text(phrase: string, opts?: {
        data?: {
            [prop: string]: any;
        };
        case?: "upper" | "lower" | "capital" | "title";
        format?: string;
    }): string;
    setLanguage(code: string, opts?: {
        reload: boolean;
    }): Promise<void>;
    getSupportedOptions(): Promise<{
        value: string;
        label: string;
    }[]>;
}
export {};
