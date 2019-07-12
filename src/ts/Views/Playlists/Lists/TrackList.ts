import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../Libraries';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Playlist from '../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import Track from '../../../Models/Tracks/Track';
import { default as Delay, DelayedOnceExecuter } from '../../../Utils/Delay';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionList from '../../Shared/SelectionList';
import SelectionTrack from '../Selections/SelectionTrack';

@Component({
    template: `<div class="col-md-9">
    <div class="card">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">Tracks</h3>
            <div class="card-tools form-row">
                <input class="form-control form-control-navbar form-control-sm text-search"
                    type="search"
                    placeholder="Track Name"
                    aria-label="Track Name"
                    ref="TextSearch"
                    @input="OnInputSearchText"/>
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
        'selection-track': SelectionTrack,
        'infinite-loading': InfiniteLoading
    }
})
export default class TrackList extends SelectionList<Track, PlaylistStore> {

    private static readonly PageLength: number = 20;

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Track[] = [];
    private playlist: Playlist = null;
    private searchTextFilter: DelayedOnceExecuter;

    private get TextSearch(): HTMLInputElement {
        return this.$refs.TextSearch as HTMLInputElement;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = false;
        await super.Initialize();

        this.searchTextFilter = Delay.DelayedOnce((): void => {
            this.Refresh();
        }, 800);

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

        if (!this.playlist.Tracks || this.playlist.Tracks.length <= 0) {
            const mpTracks = await this.store.GetTracksByPlaylist(this.playlist);
            this.playlist.Tracks = Track.CreateArrayFromMopidy(mpTracks);
        }

        let entities = Libraries.Enumerable.from(this.playlist.Tracks);
        const filterText = (this.TextSearch.value || '').toLowerCase();
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

    private OnInputSearchText(): void {
        this.searchTextFilter.Exec();
    }
}
