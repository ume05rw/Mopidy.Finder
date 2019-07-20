import Component from 'vue-class-component';
import ContentViewBase from '../Bases/ContentViewBase';
import { default as Delay, DelayedOnceExecuter } from '../../Utils/Delay';
import { default as SettingsStore, IUpdateProgress, IAlbumScanProgress } from '../../Models/Settings/SettingsStore';
import { default as SettingsEntity, ISettings } from '../../Models/Settings/Settings';
import Libraries from '../../Libraries';
import { default as ConfirmDialog, ConfirmType } from '../Shared/Dialogs/ConfirmDialog';
import ProgressDialog from '../Shared/Dialogs/ProgressDialog';
import { IContentSubView } from '../Bases/ContentSubViewBase';
import MopidyBlock from './Blocks/MopidyBlock';
import ScanProgressBlock from './Blocks/ScanProgressBlock';
import DbBlock from './Blocks/DbBlock';
import { IContentDetailArgs, ContentDetails } from '../HeaderBars/HeaderBar';
import Exception from '../../Utils/Exception';

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
                        aria-labelledby="nav-settings">
    <mopidy-block
        ref="MopidyBlock"
        @SettingsUpdated="OnSettingsUpdated" />
    <db-block
        ref="DbBlock" />
    <scan-progress-block
        ref="ScanProgressBlock" />
</section>`,
    components: {
        'mopidy-block': MopidyBlock,
        'db-block': DbBlock,
        'scan-progress-block': ScanProgressBlock,
    }
})
export default class Settings extends ContentViewBase {

    private store: SettingsStore;
    private entity: SettingsEntity;

    private get MopidyBlock(): MopidyBlock {
        return this.$refs.MopidyBlock as MopidyBlock;
    }
    private get DbBlock(): DbBlock {
        return this.$refs.DbBlock as DbBlock;
    }
    private get ScanProgressBlock(): ScanProgressBlock {
        return this.$refs.ScanProgressBlock as ScanProgressBlock;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.store = new SettingsStore();
        this.entity = await this.store.Get();

        this.MopidyBlock.SetSettings(this.store, this.entity);
        this.DbBlock.SetSettings(this.store, this.entity);
        this.ScanProgressBlock.SetSettings(this.store, this.entity);

        this.subviews.push(this.MopidyBlock);
        this.subviews.push(this.DbBlock);
        this.subviews.push(this.ScanProgressBlock);

        return true;
    }

    // #region "IContentView"
    protected subviews: IContentSubView[] = [];
    public GetIsPermitLeave(): boolean {
        // DBリフレッシュ中はページ移動NGにする。
        return true;
    }
    public InitContent(): void {
    }
    public ShowContentDetail(args: IContentDetailArgs): void {
        switch (args.Detail) {
            case ContentDetails.SetMopidy:
                this.HideAllDetails();
                this.MopidyBlock.Show();
                break;
            case ContentDetails.Database:
                this.HideAllDetails();
                this.DbBlock.Show();
                break;
            case ContentDetails.ScanProgress:
                this.HideAllDetails();
                this.ScanProgressBlock.Show();
                break;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }
    }
    // #endregion

    public OnShow(): void {
        this.ScanProgressBlock.SetTrackScanProgress();
    }

    private OnSettingsUpdated(): void {
        this.DbBlock.OnSettingsUpdated();
    }

    public InitialScan(): void {
        this.DbBlock.InitialScan()
    }

    public ShowProgress(args: string | IUpdateProgress): void {
        this.DbBlock.ShowProgress(args);
    }
}
