import * as _ from 'lodash';
import Libraries from 'src/ts/Libraries';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Playlist from '../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import { default as Delay, DelayedOnceExecuter } from '../../../Utils/Delay';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionItem from '../../Shared/SelectionItem';
import SelectionList from '../../Shared/SelectionList';

@Component({
    template: `<div class="col-md-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Playlists</h3>
            <div class="card-tools form-row">
                <input class="form-control form-control-navbar form-control-sm text-search animated bounceOut"
                    style="z-index: 0;"
                    type="search"
                    placeholder="List Name"
                    aria-label="List Name"
                    ref="TextSearch"
                    @input="OnInputSearchText"/>
                <button
                    class="btn btn-tool d-inline"
                    style="z-index: 1;"
                    ref="ButtonCollaplse"
                    @click="OnClickSearch" >
                    <i class="fa fa-search" />
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
export default class PlaylistList extends SelectionList<Playlist, PlaylistStore> {

    private static readonly PageLength: number = 30;

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Playlist[] = [];
    protected allEntities: Playlist[] = [];
    private searchTextFilter: DelayedOnceExecuter;

    private get Items(): SelectionItem<Playlist>[] {
        return this.$refs.Items as SelectionItem<Playlist>[];
    }
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

    protected OnSelectionChanged(args: ISelectionChangedArgs<Playlist>): void {
        _.each(this.Items, (si): void => {
            if (si.GetEntity() !== args.Entity && si.GetSelected()) {
                si.SetSelected(false);
            }
        });

        super.OnSelectionChanged(args);
    }

    protected async GetPagenatedList(): Promise<IPagenatedResult<Playlist>> {
        if (!this.allEntities || this.allEntities.length <= 0)
            this.allEntities = await this.store.GetPlaylists();

        let entities = Libraries.Enumerable.from(this.allEntities);
        const filterText = (this.TextSearch.value || '').toLowerCase();
        if (0 < filterText.length)
            entities = entities
                .where((e): boolean => 0 <= e.Name.toLowerCase().indexOf(filterText));

        const totalLength = entities.count();
        const pagenated = entities
            .skip((this.Page - 1) * PlaylistList.PageLength)
            .take(PlaylistList.PageLength)
            .toArray();

        const result: IPagenatedResult<Playlist> = {
            TotalLength: totalLength,
            ResultLength: pagenated.length,
            ResultList: pagenated,
            ResultPage: this.Page
        };

        return result;
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
