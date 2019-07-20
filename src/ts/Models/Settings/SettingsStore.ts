import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import { default as Settings, ISettings } from './Settings';
import Exception from '../../Utils/Exception';
import GenreStore from '../Genres/GenreStore';
import ArtistStore from '../Artists/ArtistStore';
import AlbumStore from '../Albums/AlbumStore';

export interface IUpdateProgress {
    UpdateType: 'None' | 'Cleanup' | 'ScanNew';
    IsRunning: boolean;
    Succeeded: boolean;
    Progress: number;
    Message: string;
}
export interface IAlbumScanProgress {
    TotalAlbumCount: number;
    ScannedAlbumCount: number;
}

export default class SettingsStore extends JsonRpcQueryableBase {

    public get Entity(): Settings {
        return Settings.Entity;
    }

    public async Get(): Promise<Settings> {
        const response = await this.QueryGet('Settings');

        if (!response.Succeeded)
            Exception.Throw('SettingStore.Get: Unexpected Error.', response.Errors);

        Settings.Apply(response.Result as ISettings);

        return Settings.Entity;
    }

    public async Update(settings: ISettings): Promise<boolean> {
        const response = await this.QueryPost('Settings', settings);

        if (!response.Succeeded) {
            Exception.Dump('SettingStore.Update: Unexpected Error.', response.Errors);

            return false;
        }

        const updated = response.Result as ISettings;
        Settings.Apply(updated);

        return true;
    }

    private static readonly MethodGetState = 'core.playback.get_state';
    public async TryConnect(): Promise<boolean> {
        const response = await this.JsonRpcRequest(SettingsStore.MethodGetState);

        if (response.error)
            Exception.Dump(response.error);

        Settings.Entity.SetMopidyConnectable(!(response.error));

        return Settings.Entity.IsMopidyConnectable;
    }

    public ExistsData(): Promise<boolean> {
        const genreStore = new GenreStore();
        const artistStore = new ArtistStore();
        const albumStore = new AlbumStore();

        let existsGenres: boolean = false;
        let existsArtists: boolean = false;
        let existsAlbums: boolean = false;

        const promises: Promise<any>[] = [];
        promises.push(genreStore.Exists().then((res) => { existsGenres = res; }));
        promises.push(artistStore.Exists().then((res) => { existsArtists = res; }));
        promises.push(albumStore.Exists().then((res) => { existsAlbums = res; }));

        // なぜか、Promise.all をawait した後で各bool値を比較しようとすると
        // "常にfalseになるぞ"警告が出る。
        // Promiseをまだきちんと理解してない...？
        return Promise.all(promises)
            .then(() => {
                return (
                    existsGenres === true
                    && existsArtists === true
                    && existsAlbums === true
                );
            });
    }

    public async GetAlbumScanProgress(): Promise<IAlbumScanProgress> {
        const response = await this.QueryGet('Settings/AlbumScanProgress');

        if (!response.Succeeded) {
            Exception.Dump('SettingsStore.GetDbUpdateProgress: Unexpected Error.', response.Errors);

            return {
                TotalAlbumCount: -1,
                ScannedAlbumCount: -1
            } as IAlbumScanProgress;
        }

        return response.Result as IAlbumScanProgress;
    }

    public async DbScanNew(): Promise<boolean> {
        const response = await this.QueryPost('Settings/DbScanNew');

        if (!response.Succeeded)
            Exception.Dump('SettingsStore.DbScanNew: Unexpected Error.', response.Errors);

        return response.Succeeded;
    }

    public async DbCleanup(): Promise<boolean> {
        const response = await this.QueryPost('Settings/DbCleanup');

        if (!response.Succeeded)
            Exception.Dump('SettingsStore.DbCleanup: Unexpected Error.', response.Errors);

        return response.Succeeded;
    }

    public async GetDbUpdateProgress(): Promise<IUpdateProgress> {
        const a = 1;
        const response = await this.QueryGet('Settings/UpdateProgress');

        if (!response.Succeeded) {
            Exception.Dump('SettingsStore.GetDbUpdateProgress: Unexpected Error.', response.Errors);

            return {
                IsRunning: false,
                Succeeded: false,
                Progress: 0,
                Message: 'Unexpected Error'
            } as IUpdateProgress;
        }

        return response.Result as IUpdateProgress;
    }
}
