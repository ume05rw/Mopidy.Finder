
export interface ISettings {
    ServerAddress: string;
    ServerPort: number;
}

export default class Settings implements ISettings {

    private static readonly _entity: Settings = new Settings();

    public static Get(): Settings {
        return Settings._entity;
    }

    public static Apply(newSettings: ISettings): void {
        this._entity._serverAddress = newSettings.ServerAddress;
        this._entity._serverPort = newSettings.ServerPort;
    }

    private constructor() {
    }

    private _serverAddress: string = null;
    private _serverPort: number = null;

    public get ServerAddress(): string {
        return this._serverAddress;
    }
    public get ServerPort(): number {
        return this._serverPort;
    }
}
