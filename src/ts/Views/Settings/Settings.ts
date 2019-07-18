import Component from 'vue-class-component';
import ContentViewBase from '../Bases/ContentViewBase';
import { default as Delay, DelayedOnceExecuter } from '../../Utils/Delay';
import SettingsStore from '../../Models/Settings/SettingsStore';
import { default as SettingsEntity, ISettings } from '../../Models/Settings/Settings';
import Libraries from '../../Libraries';

export const SettingsEvents = {
    ServerFound: 'ServerFound'
};

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-settings"
                        role="tabpanel"
                        aria-labelledby="settings-tab">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header with-border bg-warning">
                    <h3 class="card-title">Find Mopidy Server</h3>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="col-auto">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">http://</div>
                                </div>
                                <input type="text"
                                    maxlength="255"
                                    class="form-control"
                                    placeholder="Server Address"
                                    ref="ServerAddressInput"
                                    @input="OnServerAddressInput" />
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">:</div>
                                </div>
                                <input type="number"
                                    maxlength="5"
                                    class="form-control"
                                    placeholder="Server Port"
                                    ref="ServerPortInput"
                                    @input="OnServerPortInput" />
                                <div class="input-group-append">
                                    <div class="input-group-text">/mopidy/</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-auto">
                            {{ message }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>`,
    components: {
    }
})
export default class Settings extends ContentViewBase {

    private lazyUpdater: DelayedOnceExecuter;
    private store: SettingsStore;
    private entity: SettingsEntity;
    private message: string = '';

    private get ServerAddressInput(): HTMLInputElement {
        return this.$refs.ServerAddressInput as HTMLInputElement;
    }
    private get ServerPortInput(): HTMLInputElement {
        return this.$refs.ServerPortInput as HTMLInputElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.Update = this.Update.bind(this);
        this.lazyUpdater = Delay.DelayedOnce(() => {
            this.Update();
        }, 2000);

        this.store = new SettingsStore();
        this.entity = await this.store.Get();
        this.ServerAddressInput.value = this.entity.ServerAddress;
        this.ServerPortInput.value = this.entity.ServerPort.toString();

        return true;
    }

    private OnServerAddressInput(): void {
        this.lazyUpdater.Exec();
    }

    private OnServerPortInput(): void {
        this.lazyUpdater.Exec();
    }

    private async Update(): Promise<boolean> {
        const address = this.ServerAddressInput.value;
        const portString = this.ServerPortInput.value;

        if (!address || address.length <= 0) {
            Libraries.ShowToast.Warning('Address required.');
            return false;
        }

        const port = parseInt(portString, 10);
        if (!port) {
            Libraries.ShowToast.Warning('Port required.');
            return false;
        }

        const update: ISettings = {
            ServerAddress: address,
            ServerPort: port
        };

        if ((await this.store.Update(update)) !== true) {
            Libraries.ShowToast.Error('Update Failed...');

            return false;
        }

        const isConnectable = await this.store.TryConnect();
        if (isConnectable === true) {
            Libraries.ShowToast.Success('Server Found!');
            this.$emit(SettingsEvents.ServerFound);
        } else {
            Libraries.ShowToast.Error('Server Not Found...');
        }

        return isConnectable;
    }


    // #region "IContentView"
    public GetIsPermitLeave(): boolean {
        // DBリフレッシュ中はページ移動NGにする。
        return true;
    }
    public InitContent(): void {
    }
    // #endregion
}
