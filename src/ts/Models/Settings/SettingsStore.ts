import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import { default as Settings, ISettings } from './Settings';
import Exception from '../../Utils/Exception';

export interface IRefreshStatus {
    Finished: boolean,
    Succeeded: boolean,
    Progress: number;
    Process: string;
}

export default class SettingsStore extends JsonRpcQueryableBase {

    public async Get(): Promise<Settings> {
        const response = await this.QueryGet('Settings');

        if (!response.Succeeded)
            Exception.Throw('SettingStore.Get: Unexpected Error.', response.Errors);

        Settings.Apply(response.Result as ISettings);

        return Settings.Get();
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

        return !(response.error);
    }

    public async Refresh(): Promise<boolean> {
        const response = await this.QueryPost('Settings/Refresh');

        if (!response.Succeeded)
            Exception.Dump('SettingsStore.Refresh: Unexpected Error.', response.Errors);

        return response.Succeeded;
    }

    public async GetRefreshProgress(): Promise<IRefreshStatus> {
        const a = 1;
        const response = await this.QueryGet('Settings/Refresh');

        if (!response.Succeeded) {
            Exception.Dump('SettingsStore.Refresh: Unexpected Error.', response.Errors);

            return {
                Finished: true,
                Succeeded: false,
                Progress: 0,
                Process: 'Unexpected Error'
            } as IRefreshStatus;
        }

        return response.Result as IRefreshStatus;
    }
}
