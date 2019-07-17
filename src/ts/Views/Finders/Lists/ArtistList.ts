import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Artist from '../../../Models/Artists/Artist';
import { default as ArtistStore, IPagenateQueryArgs } from '../../../Models/Artists/ArtistStore';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Filterbox from '../../Shared/Filterboxes/Filterbox';
import { default as SelectionItem, ISelectionChangedArgs } from '../../Shared/SelectionItem';
import SelectionList from '../../Shared/SelectionList';
import Libraries from '../../../Libraries';

@Component({
    template: `<div class="col-md-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Artists</h3>
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
                <button
                    class="btn btn-tool d-inline d-md-none collapse"
                    ref="ButtonCollaplse"
                    @click="OnClickCollapse" >
                    <i class="fa fa-minus" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollable artist-list"
            ref="CardBody">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                <template v-for="entity in entities">
                <selection-item
                    ref="Items"
                    v-bind:entity="entity"
                    @SelectionChanged="OnSelectionChanged" />
                </template>
                <infinite-loading
                    @infinite="OnInfinite"
                    force-use-infinite-wrapper=".list-scrollable.artist-list"
                    ref="InfiniteLoading" />
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'filter-textbox': Filterbox,
        'selection-item': SelectionItem,
        'infinite-loading': InfiniteLoading
    }
})
export default class ArtistList extends SelectionList<Artist, ArtistStore> {

    protected store: ArtistStore = new ArtistStore();
    protected entities: Artist[] = [];
    private genreIds: number[] = [];

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }
    private get CardBody(): HTMLDivElement {
        return this.$refs.CardBody as HTMLDivElement;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = true;
        await super.Initialize();

        // 利便性的にどうなのか、悩む。
        Libraries.SlimScroll(this.CardBody, {
            height: 'calc(100vh - 140px)',
            alwaysVisible: true,
            wheelStep: 60
        });

        Libraries.SetTooltip(this.$refs.RefreshButton as HTMLElement, 'Refresh');
        Libraries.SetTooltip(this.$refs.ButtonCollaplse as HTMLElement, 'Shrink/Expand');

        return true;
    }

    /**
     * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
     * superクラスの同名メソッドが実行されるが、superクラス上のthisが
     * バインドされずにnullになってしまう。
     * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
     */
    protected async OnInfinite($state: StateChanger): Promise<boolean> {
        return super.OnInfinite($state);
    }
    protected OnClickCollapse(): void {
        super.OnClickCollapse();
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
}
