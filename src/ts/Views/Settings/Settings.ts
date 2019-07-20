import Component from 'vue-class-component';
import ContentViewBase from '../Bases/ContentViewBase';
import { default as Delay, DelayedOnceExecuter } from '../../Utils/Delay';
import { default as SettingsStore, IUpdateProgress, IAlbumScanProgress } from '../../Models/Settings/SettingsStore';
import { default as SettingsEntity, ISettings } from '../../Models/Settings/Settings';
import Libraries from '../../Libraries';
import { default as ConfirmDialog, ConfirmType } from '../Shared/Dialogs/ConfirmDialog';
import ProgressDialog from '../Shared/Dialogs/ProgressDialog';

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
                                Scan New Albums.<br/>
                                The data in <strong>Mopidy Itself is not affected.</strong>
                            </p>
                            <button class="btn btn-app btn-outline-warning disabled"
                                @click="OnScanNewButtonClicked"
                                ref="ScanNewButton">
                                <i class="fa fa-search-plus"></i> Scan New
                            </button>
                        </div>
                        <div class="col-auto ml-4">
                            <p>
                                Delete and Refresh <strong>Mopidy.Finder's Database.</strong><br/>
                                The data in <strong>Mopidy Itself is not affected.</strong>
                            </p>
                            <button class="btn btn-app btn-outline-warning disabled"
                                @click="OnCleanupButtonClicked"
                                ref="CleanupButton">
                                <i class="fa fa-refresh"></i> Cleanup
                            </button>
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
                    <h3 class="card-title">Album Scan Progress</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-auto">
                            <p>
                                Mopidy.Finder Backend is always Scanning Album-Images and belonging Tracks.<br/>
                                This action makes the operation response faster.
                            </p>
                            <div class="progress">
                                <div class="progress-bar bg-success progress-bar-striped"
                                    role="progressbar"
                                    aria-valuenow="0"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    ref="AlbumScanProgressBar">
                                    <span class="sr-only">{{ progress }}% Complete</span>
                                </div>
                            </div>
                            <p>
                                Total: {{ totalAlbumCount }} Albums.<br/>
                                Scaned: {{ scanedAlbumCount }} Albums competed.<br/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <confirm-dialog
        ref="ConfirmDialog" />
    <progress-dialog
        ref="ProgressDialog" />
</section>`,
    components: {
        'confirm-dialog': ConfirmDialog,
        'progress-dialog': ProgressDialog,
    }
})
export default class Settings extends ContentViewBase {

    private totalAlbumCount: number = 0;
    private scanedAlbumCount: number = 0;

    private lazyUpdater: DelayedOnceExecuter;
    private store: SettingsStore;
    private entity: SettingsEntity;
    private resolver: (result: boolean) => void = null;
    private timer: number = null;
    private nowPolling: boolean = false;
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
    private get ScanNewButton(): HTMLButtonElement {
        return this.$refs.ScanNewButton as HTMLButtonElement;
    }
    private get CleanupButton(): HTMLButtonElement {
        return this.$refs.CleanupButton as HTMLButtonElement;
    }
    private get AlbumScanProgressBar(): HTMLDivElement {
        return this.$refs.AlbumScanProgressBar as HTMLDivElement;
    }
    private get ConfirmDialog(): ConfirmDialog {
        return this.$refs.ConfirmDialog as ConfirmDialog;
    }
    private get ProgressDialog(): ProgressDialog {
        return this.$refs.ProgressDialog as ProgressDialog;
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
        this.SetTrackScanProgress();

        return true;
    }

    public OnShow(): void {
        this.SetTrackScanProgress();
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

        await this.store.TryConnect();
        if (this.entity.IsMopidyConnectable === true) {
            Libraries.ShowToast.Success('Mopidy Found!');
            this.$emit(SettingsEvents.ServerFound);
        } else {
            Libraries.ShowToast.Error('Mopidy Not Found...');
        }
        this.SetConnectionIcon();
        this.SetButtons();

        if (this.entity.IsMopidyConnectable && this.timer === null) {
            const exists = await this.store.ExistsData();
            if (!exists) {
                this.InitialScan();
            }
        }

        return this.entity.IsMopidyConnectable;
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

    private SetButtons(): void {
        const scanNewClasses = this.ScanNewButton.classList;
        const cleanupClasses = this.CleanupButton.classList;
        
        if (this.entity.IsMopidyConnectable === true) {
            if (scanNewClasses.contains(this.disabled))
                scanNewClasses.remove(this.disabled);
            if (cleanupClasses.contains(this.disabled))
                cleanupClasses.remove(this.disabled);
        } else {
            if (!scanNewClasses.contains(this.disabled))
                scanNewClasses.add(this.disabled);
            if (!cleanupClasses.contains(this.disabled))
                cleanupClasses.add(this.disabled);
        }
    }

    private async SetTrackScanProgress(): Promise<boolean> {
        const progress = await this.store.GetAlbumScanProgress();

        this.totalAlbumCount = progress.TotalAlbumCount;
        this.scanedAlbumCount = progress.ScannedAlbumCount;
        const rate = progress.ScannedAlbumCount / progress.TotalAlbumCount * 100;
        this.AlbumScanProgressBar.setAttribute('style', `width: ${rate}%;`);
        this.AlbumScanProgressBar.setAttribute('aria-valuenow', rate.toString());

        return true;
    }

    public async InitialScan(): Promise<boolean> {
        if (this.entity.IsMopidyConnectable !== true) {
            Libraries.ShowToast.Error('Mopidy Not Found...');
            return;
        }

        this.ConfirmDialog.SetConfirmType(ConfirmType.Normal);
        this.ConfirmDialog.SetBody('Finder Database Initialize', [
            'Mopidy found! but Finder-Data is not Initialized.',
            '',
            'Let\'s Scan New Albums for Finder Database Now!',
            '',
            'This operation may take about 10 minutes or more.',
            'It is necessary to Finder use.',
            '',
            'Are you OK?'
        ]);

        const result = await this.ConfirmDialog.Confirm();
        if (!result)
            return;

        this.TryScanNew();
    }

    // #region "Database Maintenance"
    private async OnScanNewButtonClicked(): Promise<boolean> {
        if (this.entity.IsMopidyConnectable !== true) {
            Libraries.ShowToast.Error('Mopidy Not Found...');
            return;
        }

        this.ConfirmDialog.SetConfirmType(ConfirmType.Warning);
        this.ConfirmDialog.SetBody('Scan New Albums?', [
            'Scan New Albums, and Add to Finder Database.',
            '',
            '* If you added new albums, You need to scan by mopidy first.',
            '* ex) # sudo mopidyctl local scan',
            '',
            'This operation can take a very long time, ',
            'depending on the number of songs, or the device it\'s running.',
            '',
            'Are you sure?'
        ]);

        const result = await this.ConfirmDialog.Confirm();
        if (!result)
            return;

        this.TryScanNew();
    }

    private TryScanNew(): Promise<boolean> {
        return new Promise(async (resolve: (value: boolean) => void): Promise<boolean> => {
            const result = await this.store.DbScanNew();
            if (result === true) {
                this.resolver = resolve;
                this.ShowProgress('Scannin New Albums...');

                return true;
            } else {
                this.entity.SetBusy(false);
                Libraries.ShowToast.Error('Cleanup Order Failed...');

                return false;
            }
        });
    }

    private async OnCleanupButtonClicked(): Promise<boolean> {
        if (this.entity.IsMopidyConnectable !== true) {
            Libraries.ShowToast.Error('Mopidy Not Found...');
            return;
        }

        this.ConfirmDialog.SetConfirmType(ConfirmType.Danger);
        this.ConfirmDialog.SetBody('Cleanup Mopidy.Finder Database?', [
            'Mopidy.Finder\'s Database is Deleted & Re-Scanned.',
            '',
            'This operation can take a very long time, ',
            'depending on the number of songs, or the device it\'s running.',
            '',
            'Are you sure?'
        ]);

        const result = await this.ConfirmDialog.Confirm();
        if (!result)
            return;

        this.TryRefresh();
    }
    
    private TryRefresh(): Promise<boolean> {
        return new Promise(async (resolve: (value: boolean) => void): Promise<boolean> => {
            const result = await this.store.DbCleanup();
            if (result === true) {
                this.resolver = resolve;
                this.ShowProgress('Cleanuping Database...');

                return true;
            } else {
                Libraries.ShowToast.Error('Scan Order Failed...');

                return false;
            }
        });
    }

    public async ShowProgress(args: string | IUpdateProgress): Promise<boolean> {
        if (this.timer !== null) {
            Libraries.ShowToast.Error('Already Processing...');

            return false;
        }

        this.entity.SetBusy(true);
        const title = (typeof args === 'string')
            ? args
            : ((args.UpdateType === 'Cleanup')
                ? 'Cleanuping Database...'
                : 'Scannin New Albums...');

        this.ProgressDialog.Show(title);

        this.timer = setInterval(async (): Promise<boolean> => {
            if (this.nowPolling)
                return;

            this.nowPolling = true;
            const status = await this.store.GetDbUpdateProgress();
            this.nowPolling = false;

            if (status.IsRunning) {
                this.ProgressDialog.SetUpdate(status.Progress, status.Message);

                return false;
            } else {
                clearInterval(this.timer);
                this.timer = null;

                this.ProgressDialog.Hide();
                this.entity.SetBusy(false);
                (status.Succeeded)
                    ? Libraries.ShowToast.Success('Database Updated!')
                    : Libraries.ShowToast.Error('Update Failed...');

                if (this.resolver)
                    this.resolver(status.Succeeded);

                return true
            }
        }, 1000);

        return true;
    }
    // #endregion

    // #region "IContentView"
    public GetIsPermitLeave(): boolean {
        // DBリフレッシュ中はページ移動NGにする。
        return true;
    }
    public InitContent(): void {
    }
    // #endregion
}
