import Component from 'vue-class-component';
import Libraries from '../../../Libraries';
import { default as SettingsEntity } from '../../../Models/Settings/Settings';
import { default as SettingsStore, IUpdateProgress } from '../../../Models/Settings/SettingsStore';
import ContentDetailBase from '../../Bases/ContentDetailBase';
import { ConfirmType, default as ConfirmDialog } from '../../Shared/Dialogs/ConfirmDialog';
import ProgressDialog from '../../Shared/Dialogs/ProgressDialog';

@Component({
    template: `<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header with-border bg-warning">
                <h3 class="card-title">
                    <i class="fa fa-database" />
                    Refresh Relation Data
                </h3>
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
    <confirm-dialog
        ref="ConfirmDialog" />
    <progress-dialog
        ref="ProgressDialog" />
</div>`,
    components: {
        'confirm-dialog': ConfirmDialog,
        'progress-dialog': ProgressDialog,
    }
})
export default class DbBlock extends ContentDetailBase {

    protected readonly tabId: string = 'subtab-db';
    protected readonly linkId: string = 'nav-db';

    private store: SettingsStore;
    private entity: SettingsEntity;
    private resolver: (result: boolean) => void = null;
    private timer: number = null;
    private nowPolling: boolean = false;
    private readonly disabled = 'disabled';

    private get ScanNewButton(): HTMLButtonElement {
        return this.$refs.ScanNewButton as HTMLButtonElement;
    }
    private get CleanupButton(): HTMLButtonElement {
        return this.$refs.CleanupButton as HTMLButtonElement;
    }

    private get ConfirmDialog(): ConfirmDialog {
        return this.$refs.ConfirmDialog as ConfirmDialog;
    }
    private get ProgressDialog(): ProgressDialog {
        return this.$refs.ProgressDialog as ProgressDialog;
    }

    public SetSettings(store: SettingsStore, entity: SettingsEntity): void {
        this.store = store;
        this.entity = entity;
    }

    public async OnSettingsUpdated(): Promise<boolean> {
        this.SetButtonsByConnectable();

        if (this.entity.IsMopidyConnectable && this.timer === null) {
            const exists = await this.store.ExistsData();
            if (!exists) {
                this.InitialScan();
            }
        }

        return true;
    }

    private SetButtonsByConnectable(): void {
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
}
