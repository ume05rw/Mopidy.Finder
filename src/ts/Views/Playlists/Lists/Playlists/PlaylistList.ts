import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Playlist from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import SelectionItem from '../../../Shared/SelectionItem';
import { default as SelectionList, ISelectionChangedArgs } from '../../../Shared/SelectionList';
import SlideupButton from '../../../Shared/SlideupButton';
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
                <slideup-buton
                    v-bind:hideOnInit="false"
                    iconClass="fa fa-plus-circle"
                    ref="ButtonAdd"
                    @Clicked="OnClickAdd" />
                <slideup-buton
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-minus-circle"
                    ref="ButtonDelete"
                    @Clicked="OnClickDelete" />
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
    <add-modal
        ref="AddModal"
        @AddOrdered="OnAddOrdered"/>
</div>`,
    components: {
        'filter-textbox': Filterbox,
        'slideup-buton': SlideupButton,
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

    private get ButtonAdd(): SlideupButton {
        return this.$refs.ButtonAdd as SlideupButton;
    }

    private get ButtonDelete(): SlideupButton {
        return this.$refs.ButtonDelete as SlideupButton;
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

        if (args.Selected && this.ButtonAdd.GetIsVisible()) {
            this.ButtonAdd.Hide().then((): void => {
                this.ButtonDelete.Show();
            });
        } else if (!args.Selected && this.ButtonDelete.GetIsVisible()) {
            this.ButtonDelete.Hide().then((): void => {
                this.ButtonAdd.Show();
            });
        }

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

    private SetListOperation(listSelected: boolean): void {
        if (listSelected) {

        } else {

        }
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

    private OnClickDelete(): void {

    }

    private async OnDeleteOrdered(playlist: Playlist): Promise<boolean> {

        return true;
    }
}
