import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import { default as SettingsEntity } from '../../Models/Settings/Settings';
import { default as SettingsStore, IUpdateProgress } from '../../Models/Settings/SettingsStore';
import Exception from '../../Utils/Exception';
import ContentBase from '../Bases/ContentBase';
import { ContentDetails, default as IContentDetail, IContentDetailArgs, IContentSwipeArgs } from '../Bases/IContentDetail';
import DbBlock from './Blocks/DbBlock';
import MopidyBlock from './Blocks/MopidyBlock';
import ScanProgressBlock from './Blocks/ScanProgressBlock';
import ThanksBlock from './Blocks/ThanksBlock';

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
            @SettingsUpdated="OnSettingsUpdated"
            @Swiped="OnSwiped" />
        <db-block
            ref="DbBlock"
            @Swiped="OnSwiped" />
        <scan-progress-block
            ref="ScanProgressBlock"
            @Swiped="OnSwiped" />
        <thanks-block
            ref="ThanksBlock"
            @Swiped="OnSwiped" />
    </div>
</section>`,
    components: {
        'mopidy-block': MopidyBlock,
        'db-block': DbBlock,
        'scan-progress-block': ScanProgressBlock,
        'thanks-block': ThanksBlock
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
    private get ThanksBlock(): ThanksBlock {
        return this.$refs.ThanksBlock as ThanksBlock;
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
        this.details.push(this.ThanksBlock);
        this.currentDetail = this.MopidyBlock;
        this.detailWrapperElement = this.$refs.InnerDiv as HTMLElement;

        return true;
    }

    // #region "IContentView"
    protected detailWrapperElement: HTMLElement = null;
    protected details: IContentDetail[] = [];
    protected currentDetail: IContentDetail = null;
    public GetIsPermitLeave(): boolean {
        // DBリフレッシュ中はページ移動NGにする。
        return true;
    }
    public InitContent(): void {
    }
    protected GetContentDetail(detail: ContentDetails): IContentDetail {
        switch (detail) {
            case ContentDetails.SetMopidy:
                return this.MopidyBlock;
            case ContentDetails.Database:
                return this.DbBlock;
            case ContentDetails.ScanProgress:
                return this.ScanProgressBlock;
            case ContentDetails.Thanks:
                return this.ThanksBlock;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }
    }
    public async ShowContentDetail(args: IContentDetailArgs): Promise<boolean> {
        await super.ShowContentDetail(args);

        return true;
    }
    protected OnSwiped(args: IContentSwipeArgs): void {
        super.OnSwiped(args);
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
