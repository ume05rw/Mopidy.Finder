export interface ISettings {
    ServerAddress: string;
    ServerPort: number;
}

export default class Settings implements ISettings {

    private static readonly _entity: Settings = new Settings();

    public static get Entity(): Settings {
        return Settings._entity;
    }

    public static Apply(newSettings: ISettings): void {
        this._entity._serverAddress = newSettings.ServerAddress;
        this._entity._serverPort = newSettings.ServerPort;
    }

    private _serverAddress: string = null;
    private _serverPort: number = null;
    private _isBusy = false;
    private _isMopidyConnectable: boolean = false;
    private _isTouchScreen: boolean = false;
    private _isMobile: boolean = false;
    private _isAndroid: boolean = false;
    private _isIos: boolean = false;

    public get ServerAddress(): string {
        return this._serverAddress;
    }
    public get ServerPort(): number {
        return this._serverPort;
    }
    public get IsBusy(): boolean {
        return this._isBusy;
    }
    public get IsMopidyConnectable(): boolean {
        return this._isMopidyConnectable;
    }
    public get IsTouchScreen(): boolean {
        return this._isTouchScreen;
    }
    public get IsMobile(): boolean {
        return this._isMobile;
    }
    public get IsIos(): boolean {
        return this._isIos;
    }
    public get IsAndroid(): boolean {
        return this._isAndroid;
    }

    private constructor() {
        // https://freefielder.jp/blog/2014/12/javascript-touch-screen.html
        // ontouchstartが存在しない場合はundefined、する場合でもイベントがないのでnull。
        this._isTouchScreen = (window.ontouchstart === null);

        const ua = (navigator)
            ? navigator.userAgent
            : '';

        if (
            ua.indexOf('iPhone') > 0
            || ua.indexOf('iPad') > 0
            || ua.indexOf('iPod') > 0
        ) {
            this._isMobile = true;
            this._isIos = true;
        } else if (ua.indexOf('Android') > 0) {
            this._isMobile = true;
            this._isAndroid = true;
        }
    }

    public SetBusy(isBusy: boolean): void {
        this._isBusy = isBusy;
    }
    public SetMopidyConnectable(isConnectable: boolean): void {
        this._isMopidyConnectable = isConnectable;
    }
}
