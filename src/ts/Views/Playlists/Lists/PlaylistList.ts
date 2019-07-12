import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Playlist from '../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionItem from '../../Shared/SelectionItem';
import SelectionList from '../../Shared/SelectionList';

@Component({
    template: `<div class="col-md-3">
    <div class="card">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Playlists</h3>
            <div class="card-tools">
                <button
                    class="btn btn-tool d-inline d-md-none collapse"
                    ref="ButtonCollaplse"
                    @click="OnCollapseClick" >
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

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Playlist[] = [];

    private get Items(): SelectionItem<Playlist>[] {
        return this.$refs.Items as SelectionItem<Playlist>[];
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = true;
        await super.Initialize();

        this.entities = await this.store.GetPlaylists();

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
    protected OnCollapseClick(): void {
        super.OnCollapseClick();
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
        const playlists = await this.store.GetPlaylists();

        const result: IPagenatedResult<Playlist> = {
            TotalLength: playlists.length,
            ResultLength: playlists.length,
            ResultList: playlists,
            ResultPage: 1
        };

        return result;
    }
}
