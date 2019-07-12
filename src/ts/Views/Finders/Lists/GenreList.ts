import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Genre from '../../../Models/Genres/Genre';
import { default as GenreStore, IPagenateQueryArgs } from '../../../Models/Genres/GenreStore';
import { default as Delay, DelayedOnceExecuter } from '../../../Utils/Delay';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionItem from '../../Shared/SelectionItem';
import SelectionList from '../../Shared/SelectionList';

@Component({
    template: `<div class="col-md-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-green">
            <h3 class="card-title">Genres</h3>
            <div class="card-tools form-row">
                <input class="form-control form-control-navbar form-control-sm text-search animated bounceOut"
                    style="z-index: 0;"
                    type="search"
                    placeholder="Genre Name"
                    aria-label="Genre Name"
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
export default class GenreList extends SelectionList<Genre, GenreStore> {

    protected store: GenreStore = new GenreStore();
    protected entities: Genre[] = [];
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
    protected OnSelectionChanged(args: ISelectionChangedArgs<Genre>): void {
        super.OnSelectionChanged(args);
    }
    protected async GetPagenatedList(): Promise<IPagenatedResult<Genre>> {
        const args: IPagenateQueryArgs = {
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
}
