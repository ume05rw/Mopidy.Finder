import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Playlist from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import { default as SelectionItem, ISelectionChangedArgs, ISelectionOrderedArgs } from '../../../Shared/SelectionItem';
import { default as SelectionList } from '../../../Shared/SelectionList';
import AddModal from './AddModal';

export const PlaylistListEvents = {
    AnimationEnd: 'animationend',
    PlaylistCreated: 'PlaylistCreated'
};

@Component({
    template: `<div class="col-md-3">
    <div class="card plain-list">
        <div class="card-header with-border bg-warning">
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
        <div class="card-body list-scrollbox">
            <div class="card-inner-body playlist-list"
                ref="CardInnerBody">
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
                        force-use-infinite-wrapper=".card-inner-body.playlist-list"
                        ref="InfiniteLoading" />
                </ul>
            </div>
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

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Playlist[] = [];
    protected allEntities: Playlist[] = [];

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }
    private get Items(): SelectionItem<Playlist>[] {
        return this.$refs.Items as SelectionItem<Playlist>[];
    }
    private get AddModal(): AddModal {
        return this.$refs.AddModal as AddModal;
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
        Libraries.SetTooltip(this.$refs.ButtonAdd as HTMLElement, 'Add Playlist');
        Libraries.SetTooltip(this.$refs.ButtonCollaplse as HTMLElement, 'Shrink/Expand');

        this.RefreshPlaylist();

        return true;
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
    protected OnClickCollapse(): void {
        super.OnClickCollapse();
    }
    protected async OnSelectionOrdered(args: ISelectionOrderedArgs<Playlist>): Promise<boolean> {
        return super.OnSelectionOrdered(args);
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
    // #endregion

    private OnClickAdd(): void {
        this.AddModal.Show();
    }

    private async OnAddOrdered(): Promise<boolean> {
        const name = this.AddModal.GetName();
        const playlist = await this.store.AddPlaylist(name);

        if (!playlist) {
            this.AddModal.Hide();
            Libraries.ShowToast.Error('Playlist Create Failed');

            return false;
        }

        Libraries.ShowToast.Success(`Playlist [ ${playlist.Name} ] Created.`);

        this.AddModal.Hide();        
        this.entities = [];
        this.allEntities = [];
        this.Refresh();

        this.$emit(PlaylistListEvents.PlaylistCreated);

        return true;
    }

    public RefreshPlaylist(): void {
        this.entities = [];
        this.allEntities = [];
        this.Refresh();
    }

    /**
     * 非表示時にInfiniteLoadingが反応しない現象への対策。
     */
    public LoadIfEmpty(): void {
        if (!this.entities || this.entities.length <= 0)
            this.RefreshPlaylist();
    }
}
