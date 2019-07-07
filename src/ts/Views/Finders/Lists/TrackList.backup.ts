import Vue from 'vue';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../Libraries';
import AlbumTracks from '../../../Models/AlbumTracks/AlbumTracks';
import AlbumTracksStore from '../../../Models/AlbumTracks/AlbumTracksStore';
import ViewBase from '../../Bases/ViewBase';
import { Events, IListAppendedArgs } from '../../Events/ListEvents';
import SelectionAlbumTracks from './SelectionAlbumTracks';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-6 h-100">
    <div class="card h-100">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">Tracks</h3>
            <div class="card-tools">
                <button type="button"
                        class="btn btn-tool"
                        @click="OnClickRefresh" >
                    <i class="fa fa-repeat" />
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
                <infinite-loading @infinite="OnInfinite" ref="InfiniteLoading"></infinite-loading>
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'selection-album-tracks': SelectionAlbumTracks
    }
})
export default class TrackList extends ViewBase {

    private readonly PageLength: number = 6;
    private page: number = 1;
    private albumIds: number[] = [];
    private store: AlbumTracksStore = new AlbumTracksStore();
    private entities: AlbumTracks[] = [];

    private get InfiniteLoading(): InfiniteLoading {
        return this.$refs.InfiniteLoading as InfiniteLoading;
    }

    // AlbumTracksStore.GetList()の引数変更に伴い、コメントアウト
    //public async OnInfinite($state: StateChanger): Promise<boolean> {

    //    var targetAlbumIds = Libraries.Enumerable.from(this.albumIds)
    //        .skip((this.page - 1) * this.PageLength)
    //        .take(this.PageLength)
    //        .toArray();

    //    if (0 < targetAlbumIds.length) {
    //        var result = await this.store.GetList(targetAlbumIds);

    //        if (0 < result.length)
    //            this.entities = this.entities.concat(result);

    //        $state.loaded();
    //        this.page++;

    //        if (0 < result.length) {
    //            this.$emit(Events.ListAppended, {
    //                entities: result
    //            } as IListAppendedArgs);
    //        }

    //    } else {
    //        $state.complete();
    //    }

    //    return true;
    //}

    private Refresh(): void {
        this.page = 1;
        this.entities = [];
        this.$nextTick(() => {
            this.InfiniteLoading.stateChanger.reset();
            (this.InfiniteLoading as any).attemptLoad();
        });
    }

    private OnClickRefresh(): void {
        this.Refresh();
        this.$emit(Events.Refreshed);
    }

    private OnClickItem(): void {

    }

    public ClearAlbumIds(): void {
        this.albumIds = [];
        this.Refresh();
    }

    public AppendAlbumIds(albumIds: number[]): void {
        this.albumIds = this.albumIds.concat(albumIds);

        this.InfiniteLoading.stateChanger.reset();
        (this.InfiniteLoading as any).attemptLoad();
    }
}
