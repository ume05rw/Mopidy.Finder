import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import { default as Settings, ISettings } from './Settings';
import Exception from '../../Utils/Exception';

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
}
