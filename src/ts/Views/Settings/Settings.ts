import Component from 'vue-class-component';
import { default as SettingsEntity } from '../../Models/Settings/Settings';
import { default as SettingsStore, IUpdateProgress } from '../../Models/Settings/SettingsStore';
import Dump from '../../Utils/Dump';
import Exception from '../../Utils/Exception';
import ContentBase from '../Bases/ContentBase';
import { ContentDetails, default as IContentDetail, IContentDetailArgs } from '../Bases/IContentDetail';
import DbBlock from './Blocks/DbBlock';
import MopidyBlock from './Blocks/MopidyBlock';
import ScanProgressBlock from './Blocks/ScanProgressBlock';
import Libraries from '../../Libraries';

export const SettingsEvents = {
    ServerFound: 'ServerFound'
};

@Component({
    template: `<section class="content h-100 tab-pane fade"
    id="tab-settings"
    role="tabpanel"
    aria-labelledby="nav-settings">
    <div class="w-100 h-100"
        ref="InnerDiv">
        <mopidy-block
            ref="MopidyBlock"
            @SettingsUpdated="OnSettingsUpdated" />
        <db-block
            ref="DbBlock" />
        <scan-progress-block
            ref="ScanProgressBlock" />
    </div>
</section>`,
    components: {
        'mopidy-block': MopidyBlock,
        'db-block': DbBlock,
        'scan-progress-block': ScanProgressBlock,
    }
})
export default class Settings extends ContentBase {

    private store: SettingsStore;
    private entity: SettingsEntity;

    private get InnerDiv(): HTMLDivElement {
        return this.$refs.InnerDiv as HTMLDivElement;
    }
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
        super.Initialize();

        this.store = new SettingsStore();
        this.entity = await this.store.Get();

        // 利便性的にどうなのか、悩む。
        Libraries.SlimScroll(this.InnerDiv, {
            height: 'calc(100vh - 73px)',
            wheelStep: 60
        });

        this.MopidyBlock.SetSettings(this.store, this.entity);
        this.DbBlock.SetSettings(this.store, this.entity);
        this.ScanProgressBlock.SetSettings(this.store, this.entity);

        this.details.push(this.MopidyBlock);
        this.details.push(this.DbBlock);
        this.details.push(this.ScanProgressBlock);

        return true;
    }

    // #region "IContentView"
    protected details: IContentDetail[] = [];
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
