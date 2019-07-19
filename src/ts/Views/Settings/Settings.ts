import Component from 'vue-class-component';
import ContentViewBase from '../Bases/ContentViewBase';
import { default as Delay, DelayedOnceExecuter } from '../../Utils/Delay';
import SettingsStore from '../../Models/Settings/SettingsStore';
import { default as SettingsEntity, ISettings } from '../../Models/Settings/Settings';
import Libraries from '../../Libraries';

export const SettingsEvents = {
    ServerFound: 'ServerFound'
};
interface IIconClasses {
    Icon: string;
    Wrapper: string;
}

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-settings"
                        role="tabpanel"
                        aria-labelledby="settings-tab">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header with-border bg-warning">
                    <h3 class="card-title">Set Your Mopidy</h3>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="col-auto">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="input-group-text">http://</div>
                                </div>
                                <input type="text"
                                    id="server_address"
                                    maxlength="255"
                                    class="form-control address"
                                    placeholder="Server Address"
                                    ref="ServerAddressInput"
                                    @input="OnServerAddressInput" />
                                <div class="input-group-prepend">
                                    <div class="input-group-text">:</div>
                                </div>
                                <input type="number"
                                    maxlength="5"
                                    class="form-control port"
                                    placeholder="Server Port"
                                    ref="ServerPortInput"
                                    @input="OnServerPortInput" />
                                <div class="input-group-append">
                                    <div class="input-group-text">/mopidy/</div>
                                </div>
                                <span class="connection-icon"
                                    ref="IconWrapper">
                                    <i class=""
                                        ref="Icon"/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header with-border bg-warning">
                    <h3 class="card-title">Refresh Relation Data</h3>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="col-auto">
                            <p>
                                Delete and Refresh <strong>Mopidy.Finder's Database.</strong>
                                The data in <strong>Mopidy Itself is not affected.</strong>
                            </p>
                            <button class="btn btn-app btn-outline-warning disabled"
                                @click="OnRefreshButtonClicked"
                                ref="RefreshButton">
                                <i class="fa fa-refresh"></i> Delete &amp; Refresh
                            </button>
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
    private isConnectable: boolean = false;
    private readonly disabled = 'disabled';
    private connectionClasses: { True: IIconClasses, False: IIconClasses } = {
        True: {
            Icon: 'fa fa-link',
            Wrapper: 'connection-icon connectable'
        },
        False: {
            Icon: 'fa fa-chain-broken',
            Wrapper: 'connection-icon notconnectable'
        }
    };

    private get ServerAddressInput(): HTMLInputElement {
        return this.$refs.ServerAddressInput as HTMLInputElement;
    }
    private get ServerPortInput(): HTMLInputElement {
        return this.$refs.ServerPortInput as HTMLInputElement;
    }
    private get IconWrapper(): HTMLSpanElement {
        return this.$refs.IconWrapper as HTMLSpanElement;
    }
    private get Icon(): HTMLElement {
        return this.$refs.Icon as HTMLElement;
    }
    private get RefreshButton(): HTMLButtonElement {
        return this.$refs.RefreshButton as HTMLButtonElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.Update = this.Update.bind(this);
        this.lazyUpdater = Delay.DelayedOnce(() => {
            console.log('lazyUpdater Run.');
            this.Update();
        }, 2000);

        this.store = new SettingsStore();
        this.entity = await this.store.Get();
        this.ServerAddressInput.value = this.entity.ServerAddress;
        this.ServerPortInput.value = this.entity.ServerPort.toString();

        this.Update();

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

        this.isConnectable = await this.store.TryConnect();
        if (this.isConnectable === true) {
            Libraries.ShowToast.Success('Mopidy Found!');
            this.$emit(SettingsEvents.ServerFound);
        } else {
            Libraries.ShowToast.Error('Mopidy Not Found...');
        }
        this.SetConnectionIcon();
        this.SetRefreshButton();

        return this.isConnectable;
    }

    private SetConnectionIcon(): void {
        const wrapperClasses = this.IconWrapper.classList;
        const iconClasses = this.Icon.classList;

        if (this.isConnectable === true) {
            this.IconWrapper.className = this.connectionClasses.True.Wrapper;
            this.Icon.className = this.connectionClasses.True.Icon;
        } else {
            this.IconWrapper.className = this.connectionClasses.False.Wrapper;
            this.Icon.className = this.connectionClasses.False.Icon;
        }
    }

    private SetRefreshButton(): void {
        const classes = this.RefreshButton.classList;
        if (
            this.isConnectable === true
            && classes.contains(this.disabled)
        ) {
            classes.remove(this.disabled);
        } else if (
            this.isConnectable !== true
            && !classes.contains(this.disabled)
        ) {
            classes.add(this.disabled);
        }
    }

    private OnRefreshButtonClicked(): void {
        if (this.isConnectable !== true) {
            Libraries.ShowToast.Error('Mopidy Not Found...');
            return;
        }
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
