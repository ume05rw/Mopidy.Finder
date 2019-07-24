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

    private constructor() {
        this._isTouchScreen = !(!window.ontouchstart);
    }

    public SetBusy(isBusy: boolean): void {
        this._isBusy = isBusy;
    }
    public SetMopidyConnectable(isConnectable: boolean): void {
        this._isMopidyConnectable = isConnectable;
    }
}
