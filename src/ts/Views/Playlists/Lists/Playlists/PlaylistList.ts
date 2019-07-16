import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Playlist from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import { default as SelectionItem, ISelectionOrderedArgs, ISelectionChangedArgs } from '../../../Shared/SelectionItem';
import { default as SelectionList, SelectionEvents } from '../../../Shared/SelectionList';
import AddModal from './AddModal';

export const PlaylistListEvents = {
    AnimationEnd: 'animationend'
};

@Component({
    template: `<div class="col-md-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Playlists</h3>
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'List?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()"/>
                <button
                    class="btn btn-tool d-inline d-md-none collapse"
                    ref="ButtonCollaplse"
                    @click="OnClickCollapse" >
                    <i class="fa fa-minus" />
                </button>
                <button
                    class="btn btn-tool"
                    ref="ButtonAdd"
                    @click="OnClickAdd" >
                    <i class="fa fa-plus-circle" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollable playlist-list">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                <template v-for="entity in entities">
                <selection-item
                    ref="Items"
                    v-bind:entity="entity"
                    @SelectionOrdered="OnSelectionOrdered"
                    @SelectionChanged="OnSelectionChanged" />
                </template>
                <infinite-loading
                    @infinite="OnInfinite"
                    force-use-infinite-wrapper=".list-scrollable.playlist-list"
                    ref="InfiniteLoading" />
            </ul>
        </div>
    </div>
    <add-modal
        ref="AddModal"
        @AddOrdered="OnAddOrdered"/>
</div>`,
    components: {
        'filter-textbox': Filterbox,
        'selection-item': SelectionItem,
        'infinite-loading': InfiniteLoading,
        'add-modal': AddModal
    }
})
export default class PlaylistList extends SelectionList<Playlist, PlaylistStore> {

    private static readonly PageLength: number = 30;
    private static readonly Classes = {
        DisplayNone: 'd-none',
        Animated: 'animated',
        In: 'fadeInUp',
        Out: 'fadeOutDown',
        Speed: 'faster'
    };

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Playlist[] = [];
    protected allEntities: Playlist[] = [];
    private windowAdd: JQuery;

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }

    private get Items(): SelectionItem<Playlist>[] {
        return this.$refs.Items as SelectionItem<Playlist>[];
    }

    private get AddModal(): AddModal {
        return this.$refs.AddModal as AddModal;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = true;
        await super.Initialize();

        Libraries.$(this.$refs.ButtonAdd as HTMLElement).tooltip({
            placement: 'top',
            title: 'Add Playlist'
        });
        Libraries.$(this.$refs.ButtonCollaplse as HTMLElement).tooltip({
            placement: 'top',
            title: 'Shrink/Expand'
        });

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
    protected async OnSelectionOrdered(args: ISelectionOrderedArgs<Playlist>): Promise<boolean> {
        console.log('PlaylistList.OnPlaylistsSelectionOrdered:')
        console.log(args);
        return super.OnSelectionOrdered(args);
    }

    protected OnSelectionChanged(args: ISelectionChangedArgs<Playlist>): void {
        console.log('PlaylistList.OnSelectionChanged:')
        console.log(args);

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
        const filterText = this.Filterbox.GetText().toLowerCase();
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

    private OnClickAdd(): void {
        this.AddModal.Show();
    }

    private async OnAddOrdered(): Promise<boolean> {
        const name = this.AddModal.GetName();
        await this.store.AddPlaylist(name);

        this.AddModal.Hide();
        this.allEntities = [];
        this.Refresh();

        return true;
    }
}
