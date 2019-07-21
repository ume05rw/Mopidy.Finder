import Component from 'vue-class-component';
import Libraries from '../../../Libraries';
import { default as SettingsEntity, ISettings } from '../../../Models/Settings/Settings';
import { default as SettingsStore } from '../../../Models/Settings/SettingsStore';
import { default as Delay, DelayedOnceExecuter } from '../../../Utils/Delay';
import ContentDetailBase from '../../Bases/ContentDetailBase';

export const MopidyBlockEvents = {
    SettingsUpdated: 'SettingsUpdated'
};
interface IIconClasses {
    Icon: string;
    Wrapper: string;
}

@Component({
    template: `<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header with-border bg-warning">
                <h3 class="card-title">
                    <i class="fa fa-wifi" />
                    Set Your Mopidy
                </h3>
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
                                autocomplete="off"
                                ref="ServerAddressInput"
                                @input="OnServerAddressInput" />
                            <div class="input-group-prepend">
                                <div class="input-group-text">:</div>
                            </div>
                            <input type="number"
                                maxlength="5"
                                class="form-control port"
                                placeholder="Port"
                                autocomplete="off"
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
</div>`
})
export default class MopidyBlock extends ContentDetailBase {

    protected readonly tabId: string = 'subtab-mopidy';
    protected readonly linkId: string = 'nav-mopidy';

    private readonly classInvalid: string = 'is-invalid';
    private lazyUpdater: DelayedOnceExecuter;
    private store: SettingsStore;
    private entity: SettingsEntity;
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


    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.Update = this.Update.bind(this);
        this.lazyUpdater = Delay.DelayedOnce(() => {
            console.log('lazyUpdater Run.');
            this.Update();
        }, 2000);

        return true;
    }

    public SetSettings(store: SettingsStore, entity: SettingsEntity): void {
        this.store = store;
        this.entity = entity;

        this.ServerAddressInput.value = this.entity.ServerAddress;
        this.ServerPortInput.value = this.entity.ServerPort.toString();

        this.Update();
    }

    private OnServerAddressInput(): void {
        this.lazyUpdater.Exec();
    }

    private OnServerPortInput(): void {
        this.lazyUpdater.Exec();
    }

    private async Update(): Promise<boolean> {
        if (!this.Validate())
            return;

        const address = this.ServerAddressInput.value;
        const port = parseInt(this.ServerPortInput.value, 10);

        const update: ISettings = {
            ServerAddress: address,
            ServerPort: port
        };

        if ((await this.store.Update(update)) !== true) {
            Libraries.ShowToast.Error('Update Failed...');
        } else {
            await this.store.TryConnect();
            if (this.entity.IsMopidyConnectable === true) {
                Libraries.ShowToast.Success('Mopidy Found!');

            } else {
                Libraries.ShowToast.Error('Mopidy Not Found...');
            }
        }

        this.SetConnectionIcon();
        this.$emit(MopidyBlockEvents.SettingsUpdated);

        return this.entity.IsMopidyConnectable;
    }

    private Validate(): boolean {
        const address = this.ServerAddressInput.value;
        const portString = this.ServerPortInput.value;
        let result = true;

        // 一旦エラークラスを削除
        if (this.ServerAddressInput.classList.contains(this.classInvalid))
            this.ServerAddressInput.classList.remove(this.classInvalid);
        if (this.ServerPortInput.classList.contains(this.classInvalid))
            this.ServerPortInput.classList.remove(this.classInvalid);

        if (!address || address.length <= 0) {
            this.ServerAddressInput.classList.add(this.classInvalid);
            if (result === true) {
                Libraries.ShowToast.Warning('Address required.');
                result = false;
            }
        }

        if (255 < address.length) {
            this.ServerAddressInput.classList.add(this.classInvalid);
            if (result === true) {
                Libraries.ShowToast.Warning('Address too long.');
                result = false;
            }
        }

        if (!portString || portString.length <= 0) {
            this.ServerPortInput.classList.add(this.classInvalid);
            if (result === true) {
                Libraries.ShowToast.Warning('Port required.');
                result = false;
            }
        } else {
            const port = parseInt(portString, 10);
            if (!port) {
                this.ServerPortInput.classList.add(this.classInvalid);
                Libraries.ShowToast.Warning('Please enter a number.');
                result = false;
            }
        }

        return result;
    }

    private SetConnectionIcon(): void {
        const wrapperClasses = this.IconWrapper.classList;
        const iconClasses = this.Icon.classList;

        if (this.entity.IsMopidyConnectable === true) {
            this.IconWrapper.className = this.connectionClasses.True.Wrapper;
            this.Icon.className = this.connectionClasses.True.Icon;
        } else {
            this.IconWrapper.className = this.connectionClasses.False.Wrapper;
            this.Icon.className = this.connectionClasses.False.Icon;
        }
    }


}
