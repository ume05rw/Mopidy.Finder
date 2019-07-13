import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Playlist from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Track from '../../../../Models/Tracks/Track';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import { default as SelectionList, ISelectionChangedArgs } from '../../../Shared/SelectionList';
import SelectionTrack from './SelectionTrack';
import SlideupButton from '../../../Shared/SlideupButton';

@Component({
    template: `<div class="col-md-9">
    <div class="card">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">Tracks</h3>
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'Track?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()" />
                <slideup-button
                    v-bind:hideOnInit="false"
                    iconClass="fa fa-pencil-square"
                    ref="EditButton"
                    @Clicked="OnClickEdit" />
                <slideup-button
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-trash"
                    ref="DeleteButton"
                    @Clicked="OnClickDelete" />
                <slideup-button
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-check"
                    ref="EndEditButton"
                    @Clicked="OnClickEndEdit" />
            </div>
        </div>
        <div class="card-body list-scrollable">
            <ul class="products-list product-list-in-box">
                <template v-for="entity in entities">
                <selection-track
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
        'filter-textbox': Filterbox,
        'slideup-button': SlideupButton,
        'selection-track': SelectionTrack,
        'infinite-loading': InfiniteLoading
    }
})
export default class TrackList extends SelectionList<Track, PlaylistStore> {

    private static readonly PageLength: number = 20;

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Track[] = [];
    private playlist: Playlist = null;

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }

    private get EditButton(): SlideupButton {
        return this.$refs.EditButton as SlideupButton;
    }
    private get DeleteButton(): SlideupButton {
        return this.$refs.DeleteButton as SlideupButton;
    }
    private get EndEditButton(): SlideupButton {
        return this.$refs.EndEditButton as SlideupButton;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = false;
        await super.Initialize();

        return true;
    }

    public async SetPlaylist(playlist: Playlist): Promise<boolean> {
        this.playlist = (playlist)
            ? playlist
            : null;
        this.entities = [];

        for (let i = 0; i < this.playlist.Tracks.length; i++)
            this.playlist.Tracks[i].TlId = null;

        this.Refresh();

        return true;
    }

    private OnClickEdit(): void {
        this.EditButton.Hide().then((): void => {
            this.DeleteButton.Show();
            this.EndEditButton.Show();
        });
    }

    private OnClickDelete(): void {

    }

    private OnClickEndEdit(): void {
        this.DeleteButton.Hide();
        this.EndEditButton.Hide().then((): void => {
            this.EditButton.Show();
        });
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
    protected OnSelectionChanged(args: ISelectionChangedArgs<Track>): void {
        const isAllTracksRegistered = Libraries.Enumerable.from(this.playlist.Tracks)
            .all((e): boolean => e.TlId !== null);

        (isAllTracksRegistered)
            ? this.store.PlayByTlId(args.Entity.TlId)
            : this.store.PlayPlaylist(this.playlist, args.Entity);
    }
    protected async GetPagenatedList(): Promise<IPagenatedResult<Track>> {
        if (!this.playlist) {
            const result: IPagenatedResult<Track> = {
                ResultLength: 0,
                TotalLength: 0,
                ResultList: [],
                ResultPage: 1
            };

            return result;
        }

        if (!this.playlist.Tracks || this.playlist.Tracks.length <= 0)
            this.playlist.Tracks = await this.store.GetTracksByPlaylist(this.playlist);

        let entities = Libraries.Enumerable.from(this.playlist.Tracks);
        const filterText = this.Filterbox.GetText().toLowerCase();
        if (0 < filterText.length)
            entities = entities
                .where((e): boolean => 0 <= e.LowerName.indexOf(filterText));

        const totalLength = entities.count();
        const pagenated = entities
            .skip((this.Page - 1) * TrackList.PageLength)
            .take(TrackList.PageLength)
            .toArray();

        const result: IPagenatedResult<Track> = {
            TotalLength: totalLength,
            ResultLength: pagenated.length,
            ResultList: pagenated,
            ResultPage: this.Page
        };

        return result;
    }
}
