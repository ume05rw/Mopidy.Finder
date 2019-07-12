import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Artist from '../../../Models/Artists/Artist';
import { default as ArtistStore, IPagenateQueryArgs } from '../../../Models/Artists/ArtistStore';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import { default as Delay, DelayedOnceExecuter } from '../../../Utils/Delay';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionItem from '../../Shared/SelectionItem';
import SelectionList from '../../Shared/SelectionList';

@Component({
    template: `<div class="col-md-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Artists</h3>
            <div class="card-tools form-row">
                <input class="form-control form-control-navbar form-control-sm text-search animated bounceOut"
                    style="z-index: 0;"
                    type="search"
                    placeholder="Artist Name"
                    aria-label="Artist Name"
                    ref="TextSearch"
                    @input="OnInputSearchText"/>
                <button
                    class="btn btn-tool d-inline"
                    style="z-index: 1;"
                    ref="ButtonCollaplse"
                    @click="OnClickSearch" >
                    <i class="fa fa-search" />
                </button>
                <button type="button"
                    class="btn btn-tool"
                    style="z-index: 1;"
                    @click="OnClickRefresh" >
                    <i class="fa fa-repeat" />
                </button>
                <button
                    class="btn btn-tool d-inline d-md-none collapse"
                    style="z-index: 1;"
                    ref="ButtonCollaplse"
                    @click="OnClickCollapse" >
                    <i class="fa fa-minus" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollable">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                <template v-for="entity in entities">
                <selection-item
                    ref="Items"
                    v-bind:entity="entity"
                    @SelectionChanged="OnSelectionChanged" />
                </template>
                <infinite-loading
                    @infinite="OnInfinite"
                    ref="InfiniteLoading" />
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'selection-item': SelectionItem,
        'infinite-loading': InfiniteLoading
    }
})
export default class ArtistList extends SelectionList<Artist, ArtistStore> {

    protected store: ArtistStore = new ArtistStore();
    protected entities: Artist[] = [];
    private genreIds: number[] = [];
    private searchTextFilter: DelayedOnceExecuter;

    private get TextSearch(): HTMLInputElement {
        return this.$refs.TextSearch as HTMLInputElement;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = true;
        await super.Initialize();

        this.searchTextFilter = Delay.DelayedOnce((): void => {
            this.Refresh();
        }, 800);

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
            FilterText: this.TextSearch.value,
            Page: this.Page
        };

        return await this.store.GetList(args);
    }

    private OnClickSearch(): void {
        if (this.TextSearch.classList.contains('bounceOut')) {
            this.TextSearch.classList.remove('bounceOut');
            this.TextSearch.classList.add('bounceIn');
        } else {
            this.TextSearch.classList.remove('bounceIn');
            this.TextSearch.classList.add('bounceOut');
        }
    }

    private OnInputSearchText(): void {
        this.searchTextFilter.Exec();
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
