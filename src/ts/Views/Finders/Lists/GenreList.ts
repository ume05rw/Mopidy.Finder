import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../Libraries';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Genre from '../../../Models/Genres/Genre';
import { default as GenreStore, IPagenateQueryArgs } from '../../../Models/Genres/GenreStore';
import Filterbox from '../../Shared/Filterboxes/Filterbox';
import { default as SelectionItem, ISelectionChangedArgs } from '../../Shared/SelectionItem';
import SelectionList from '../../Shared/SelectionList';

@Component({
    template: `<div class="col-md-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title">Genres</h3>
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
                <button
                    class="btn btn-tool d-inline d-md-none collapse"
                    ref="ButtonCollaplse"
                    @click="OnClickCollapse" >
                    <i class="fa fa-minus" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollbox">
            <div class="card-inner-body genre-list"
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
                        force-use-infinite-wrapper=".card-inner-body.genre-list"
                        ref="InfiniteLoading" />
                </ul>
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
export default class GenreList extends SelectionList<Genre, GenreStore> {

    protected store: GenreStore = new GenreStore();
    protected entities: Genre[] = [];

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }
    private get CardInnerBody(): HTMLDivElement {
        return this.$refs.CardInnerBody as HTMLDivElement;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = true;
        await super.Initialize();

        // 利便性的にどうなのか、悩む。
        Libraries.SlimScroll(this.CardInnerBody, {
            height: 'calc(100vh - 200px)',
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
}
