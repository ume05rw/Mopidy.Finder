import Component from 'vue-class-component';
import { IPagenatedResult } from '../../../Models/Bases/StoreBase';
import Playlist from '../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import Track from '../../../Models/Tracks/Track';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionList from '../../Shared/SelectionList';
import SelectionTrack from '../Selections/SelectionTrack';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../Libraries';

@Component({
    template: `<div class="col-md-9">
    <div class="card">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">Tracks</h3>
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
        super.OnSelectionChanged(args);
    }

    protected async GetPagenatedList(): Promise<IPagenatedResult<Track>> {
        if (!this.playlist) {
            return {
                ResultLength: 0,
                TotalLength: 0,
                ResultList: [],
                ResultPage: 1
            } as IPagenatedResult<Track>;
        }

        if (!this.playlist.Tracks || this.playlist.Tracks.length <= 0) {
            const mpTracks = await this.store.GetTracksByPlaylist(this.playlist);
            this.playlist.Tracks = Track.CreateArrayFromMopidy(mpTracks);
        }

        const entities = Libraries.Enumerable.from(this.playlist.Tracks)
            .skip((this.Page - 1) * TrackList.PageLength)
            .take(TrackList.PageLength)
            .toArray();

        return {
            TotalLength: this.playlist.Tracks.length,
            ResultLength: entities.length,
            ResultList: entities,
            ResultPage: this.Page
        } as IPagenatedResult<Track>
    }
}
