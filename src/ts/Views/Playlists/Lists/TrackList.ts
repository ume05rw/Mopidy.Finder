import Component from 'vue-class-component';
import { PagenatedResult } from '../../../Models/Bases/StoreBase';
import Playlist from '../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import Track from '../../../Models/Tracks/Track';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionList from '../../Shared/SelectionList';
import SelectionTrack from '../Selections/SelectionTrack';

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
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'selection-track': SelectionTrack
    }
})
export default class TrackList extends SelectionList<Track, PlaylistStore> {

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Track[] = [];
    private playlist: Playlist = null;

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = false;
        await super.Initialize();
        return true;
    }

    public async SetPlaylist(playlist: Playlist): Promise<boolean> {
        if (!playlist) {
            this.playlist = null;
            this.entities = [];
            return false;
        }

        this.playlist = playlist;
        if (!this.playlist.MopidyTracks || this.playlist.MopidyTracks.length <= 0) {
            const mpTracks = await this.store.GetTracksByPlaylist(this.playlist);
            this.playlist.MopidyTracks = mpTracks;
            this.playlist.Tracks = Track.CreateArrayByMopidy(mpTracks);
        }

        this.entities = this.playlist.Tracks;

        return true;
    }

    /**
     * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
     * superクラスの同名メソッドが実行されるが、superクラス上のthisが
     * バインドされずにnullになってしまう。
     * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
     */
    protected OnSelectionChanged(args: ISelectionChangedArgs<Track>): void {
        super.OnSelectionChanged(args);
    }

    protected async GetPagenatedList(): Promise<PagenatedResult<Track>> {
        return null;
    }
}
