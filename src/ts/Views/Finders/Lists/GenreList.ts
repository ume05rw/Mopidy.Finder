import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../Libraries';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Genre from '../../../Models/Genres/Genre';
import { default as GenreStore, IPagenateQueryArgs } from '../../../Models/Genres/GenreStore';
import { Contents } from '../../Bases/IContent';
import { ContentDetailEvents, ContentDetails, IContentSwipeArgs, SwipeDirection } from '../../Bases/IContentDetail';
import SelectionListBase from '../../Bases/SelectionListBase';
import { SwipeEvents } from '../../Events/HammerEvents';
import Filterbox from '../../Shared/Filterboxes/Filterbox';
import { default as SelectionItem, ISelectionChangedArgs } from '../../Shared/SelectionItem';

@Component({
    template: `<div class="col-lg-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title">
                <i class="fa fa-tags" />
                Genres
            </h3>
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'Genre?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()"/>
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
                <div class="inner-scrollbox genre-list">
                    <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                        <template v-for="entity in entities">
                            <selection-item
                                ref="Items"
                                v-bind:entity="entity"
                                @SelectionChanged="OnSelectionChanged" />
                        </template>
                        <infinite-loading
                            @infinite="OnInfinite"
                            force-use-infinite-wrapper=".inner-scrollbox.genre-list"
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
export default class GenreList extends SelectionListBase<Genre, GenreStore> {

    protected readonly tabId: string = 'subtab-genres';
    protected readonly linkId: string = 'nav-genres';
    protected store: GenreStore = new GenreStore();
    protected entities: Genre[] = [];
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
        this.swipeDetector.on(SwipeEvents.Left, () => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: ContentDetails.Artists,
                Direction: SwipeDirection.Left
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        this.swipeDetector.on(SwipeEvents.Right, () => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: null,
                Direction: SwipeDirection.Right
            };
            this.$emit(ContentDetailEvents.Swiped, args);            
        });

        //// 利便性的にどうなのか、悩む。
        //Libraries.SlimScroll(this.CardInnerBody, {
        //    height: 'calc(100vh - 200px)',
        //    wheelStep: 60
        //});
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
    protected OnSelectionChanged(args: ISelectionChangedArgs<Genre>): void {
        super.OnSelectionChanged(args);
    }
    protected async GetPagenatedList(): Promise<IPagenatedResult<Genre>> {
        const args: IPagenateQueryArgs = {
            FilterText: this.Filterbox.GetText(),
            Page: this.Page
        };

        return await this.store.GetList(args);
    }
    // #endregion
}
