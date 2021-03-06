import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../Libraries';
import Artist from '../../../Models/Artists/Artist';
import { default as ArtistStore, IPagenateQueryArgs } from '../../../Models/Artists/ArtistStore';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import { Contents } from '../../Bases/IContent';
import { ContentDetailEvents, ContentDetails, IContentSwipeArgs, SwipeDirection } from '../../Bases/IContentDetail';
import SelectionListBase from '../../Bases/SelectionListBase';
import { SwipeEvents } from '../../Events/HammerEvents';
import Filterbox from '../../Shared/Filterboxes/Filterbox';
import { default as SelectionItem, ISelectionChangedArgs, ISelectionOrderedArgs } from '../../Shared/SelectionItem';

@Component({
    template: `<div class="col-lg-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title">
                <i class="fa fa-users" />
                Artists
            </h3>
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'Artist?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()"/>
                </button>
                <button type="button"
                    class="btn btn-tool"
                    ref="RefreshButton"
                    @click="OnClickRefresh" >
                    <i class="fa fa-repeat" />
                </button>
            </div>
        </div>
        <div class="card-body listbox">
            <div class="outer-scrollbox">
                <div class="inner-scrollbox artist-list"
                    ref="CardInnerBody">
                    <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                        <template v-for="entity in entities">
                        <selection-item
                            ref="Items"
                            v-bind:entity="entity"
                            @SelectionChanged="OnSelectionChanged" />
                        </template>
                        <infinite-loading
                            @infinite="OnInfinite"
                            force-use-infinite-wrapper=".inner-scrollbox.artist-list"
                            ref="InfiniteLoading" />
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>`,
    components: {
        'filter-textbox': Filterbox,
        'selection-item': SelectionItem,
        'infinite-loading': InfiniteLoading
    }
})
export default class ArtistList extends SelectionListBase<Artist, ArtistStore> {

    protected readonly isMultiSelect: boolean = false;
    protected readonly tabId: string = 'subtab-artists';
    protected readonly linkId: string = 'nav-artists';
    protected store: ArtistStore = new ArtistStore();
    protected entities: Artist[] = [];
    private genreIds: number[] = [];
    private swipeDetector: HammerManager;

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.swipeDetector = new Libraries.Hammer(this.$el as HTMLElement);
        this.swipeDetector.get('swipe').set({
            direction: Libraries.Hammer.DIRECTION_HORIZONTAL
        });
        this.swipeDetector.on(SwipeEvents.Left, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: ContentDetails.AlbumTracks,
                Direction: SwipeDirection.Left
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        this.swipeDetector.on(SwipeEvents.Right, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: ContentDetails.Genres,
                Direction: SwipeDirection.Right
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        Libraries.SetTooltip(this.$refs.RefreshButton as HTMLElement, 'Refresh');
        Libraries.SetTooltip(this.$refs.ButtonCollaplse as HTMLElement, 'Shrink/Expand');

        return true;
    }

    /**
     * 非表示時にInfiniteLoadingが反応しない現象への対策。
     */
    public LoadIfEmpty(): void {
        if (!this.entities || this.entities.length <= 0)
            this.Refresh();
    }

    public ForceRefresh(): void {
        this.genreIds = [];
        this.entities = [];
        this.Refresh();
    }

    // #region "InfiniteLoading"
    /**
     * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
     * superクラスの同名メソッドが実行されるが、superクラス上のthisが
     * バインドされずにnullになってしまう。
     * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
     */
    protected async OnInfinite($state: StateChanger): Promise<boolean> {
        return super.OnInfinite($state);
    }
    protected OnClickRefresh(): void {
        super.OnClickRefresh();
    }
    protected OnSelectionChanged(args: ISelectionChangedArgs<Artist>): void {
        super.OnSelectionChanged(args);
    }
    protected async GetPagenatedList(): Promise<IPagenatedResult<Artist>> {
        const args: IPagenateQueryArgs = {
            GenreIds: this.genreIds,
            FilterText: this.Filterbox.GetText(),
            Page: this.Page
        };

        return await this.store.GetList(args);
    }
    // #endregion

    // #region "Filters"
    private HasGenre(genreId: number): boolean {
        return (0 <= _.indexOf(this.genreIds, genreId));
    }

    public AddFilterGenreId(genreId: number): void {
        if (!this.HasGenre(genreId)) {
            this.genreIds.push(genreId);
            this.Refresh();
        }
    }

    public RemoveFilterGenreId(genreId: number): void {
        if (this.HasGenre(genreId)) {
            _.pull(this.genreIds, genreId);
            this.Refresh();
        }
    }

    public RemoveAllFilters(): void {
        if (0 < this.genreIds.length) {
            this.genreIds = [];
            this.Refresh();
        }
    }
    // #endregion
}
