import Component from 'vue-class-component';
import { PagenatedResult } from '../../../Models/Bases/StoreBase';
import ITrack from '../../../Models/Mopidies/ITrack';
import Playlist from '../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import SelectionList from '../../Shared/SelectionList';
import SelectionTrack from '../Selections/SelectionTrack';
import * as _ from 'lodash';

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
                    v-bind:store="store"
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
export default class TrackList extends SelectionList<ITrack, PlaylistStore> {

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: ITrack[] = [];
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
        if (!this.playlist.Tracks || this.playlist.Tracks.length <= 0)
            this.playlist.Tracks = await this.store.GetTracksByPlaylist(this.playlist);

        this.entities = this.playlist.Tracks;

        this.$nextTick(() => {
            _.each(this.$refs.Items, (item: SelectionTrack) => {
                item.Refresh();
            });
        });

        return true;
    }

    /**
     * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
     * superクラスの同名メソッドが実行されるが、superクラス上のthisが
     * バインドされずにnullになってしまう。
     * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
     */
    protected OnSelectionChanged(args: ISelectionChangedArgs<ITrack>): void {
        super.OnSelectionChanged(args);
    }

    protected async GetPagenatedList(): Promise<PagenatedResult<ITrack>> {
        return null;
    }
}
