import Component from 'vue-class-component';
import Track from '../../../Models/Tracks/Track';
import AlbumTracksStore from '../../../Models/AlbumTracks/AlbumTracksStore';
import AlbumTracks from '../../../Models/AlbumTracks/AlbumTracks';
import ViewBase from '../../Bases/ViewBase';
import SelectionAlbumTracks from './SelectionAlbumTracks';

@Component({
    template: `<div class="col-md-6 h-100">
    <div class="card h-100">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">Artists</h3>
            <div class="card-tools">
                <button type="button"
                        class="btn btn-tool"
                        @click="OnClickRefresh" >
                    <i class="fas fa-redo" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollable">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
            <template v-for="entity in entities">
                <selection-album-tracks
                    ref="AlbumTracks"
                    v-bind:entity="entity"
                    @click="OnClickItem" />
            </template>
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'selection-album-tracks': SelectionAlbumTracks
    }
})
export default class TrackList extends ViewBase {

    private readonly PageLength: number = 10;
    private albumIds: number[] = [];
    private store: AlbumTracksStore = new AlbumTracksStore();
    private entities: AlbumTracks[] = [];

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        //this.entities = (await this.store.GetList())
        //    .orderBy(e => e.Name)
        //    .toArray();

        return true;
    }

    private OnClickRefresh(): void {

    }

    private OnClickItem(): void {

    }
}
