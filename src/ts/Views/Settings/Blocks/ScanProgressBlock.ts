import Component from 'vue-class-component';
import Libraries from '../../../Libraries';
import { default as SettingsEntity } from '../../../Models/Settings/Settings';
import { default as SettingsStore } from '../../../Models/Settings/SettingsStore';
import ContentDetailBase from '../../Bases/ContentDetailBase';
import { Contents } from '../../Bases/IContent';
import { ContentDetailEvents, ContentDetails, IContentSwipeArgs, SwipeDirection } from '../../Bases/IContentDetail';
import { SwipeEvents } from '../../Events/HammerEvents';

@Component({
    template: `<div class="row content-detail">
    <div class="col-12  card-wrapper">
        <div class="card settings scanprogress">
            <div class="card-header with-border bg-warning">
                <h3 class="card-title">
                    <i class="fa fa-rocket" />
                    Album Scan Progress
                </h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-auto">
                        <p>
                            Mopidy.Finder Backend is Scanning Album-Images and belonging Tracks.<br/>
                            This action makes app-response faster.
                        </p>
                        <div class="progress">
                            <div class="progress-bar bg-success progress-bar-striped"
                                role="progressbar"
                                aria-valuenow="0"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                ref="AlbumScanProgressBar">
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
</div>`
})
export default class ScanProgressBlock extends ContentDetailBase {

    protected readonly tabId: string = 'subtab-scanprogress';
    protected readonly linkId: string = 'nav-scanprogress';

    private totalAlbumCount: number = 0;
    private scanedAlbumCount: number = 0;
    private store: SettingsStore;
    private entity: SettingsEntity;
    private swipeDetector: HammerManager;

    private get AlbumScanProgressBar(): HTMLDivElement {
        return this.$refs.AlbumScanProgressBar as HTMLDivElement;
    }

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.swipeDetector = new Libraries.Hammer(this.$el as HTMLElement);
        this.swipeDetector.get('swipe').set({
            direction: Libraries.Hammer.DIRECTION_HORIZONTAL
        });
        this.swipeDetector.on(SwipeEvents.Left, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Settings,
                ContentDetail: ContentDetails.Thanks,
                Direction: SwipeDirection.Left
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        this.swipeDetector.on(SwipeEvents.Right, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Settings,
                ContentDetail: ContentDetails.Database,
                Direction: SwipeDirection.Right
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        return true;
    }

    public SetSettings(store: SettingsStore, entity: SettingsEntity): void {
        this.store = store;
        this.entity = entity;

        this.SetTrackScanProgress();
    }

    public async SetTrackScanProgress(): Promise<boolean> {
        const progress = await this.store.GetAlbumScanProgress();

        this.totalAlbumCount = progress.TotalAlbumCount;
        this.scanedAlbumCount = progress.ScannedAlbumCount;
        const rate = progress.ScannedAlbumCount / progress.TotalAlbumCount * 100;
        this.AlbumScanProgressBar.setAttribute('style', `width: ${rate}%;`);
        this.AlbumScanProgressBar.setAttribute('aria-valuenow', rate.toString());

        return true;
    }
}
