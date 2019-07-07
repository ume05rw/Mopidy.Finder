import * as _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import AlbumTracks from '../../../Models/AlbumTracks/AlbumTracks';
import AlbumTracksStore from '../../../Models/AlbumTracks/AlbumTracksStore';
import ViewBase from '../../Bases/ViewBase';
import { Events } from '../../Events/ListEvents';
import SelectionAlbumTracks from './SelectionAlbumTracks';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-6 h-100">
    <div class="card h-100">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">Albums</h3>
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
export default class AlbumList extends ViewBase {

    private page: number = 1;
    private genreIds: number[] = [];
    private artistIds: number[] = [];

    private store: AlbumTracksStore = new AlbumTracksStore();
    private entities: AlbumTracks[] = [];

    private get InfiniteLoading(): InfiniteLoading {
        return this.$refs.InfiniteLoading as InfiniteLoading;
    }

    public async OnInfinite($state: StateChanger): Promise<boolean> {

        var result = await this.store.GetList(this.genreIds, this.artistIds, this.page);

        if (0 < result.ResultList.length)
            this.entities = this.entities.concat(result.ResultList);

        if (this.entities.length < result.TotalLength) {
            $state.loaded();
            this.page++;
        } else {
            $state.complete();
        }

        return true;
    }

    private OnClickRefresh(): void {
        this.Refresh();
        this.$emit(Events.Refreshed);
    }

    private OnClickItem(): void {

    }

    private Refresh(): void {
        this.page = 1;
        this.entities = [];
        this.$nextTick(() => {
            this.InfiniteLoading.stateChanger.reset();
            (this.InfiniteLoading as any).attemptLoad();
        });
    }

    private HasGenre(genreId: number): boolean {
        return (0 <= _.indexOf(this.genreIds, genreId));
    }

    private HasArtist(artistId: number): boolean {
        return (0 <= _.indexOf(this.artistIds, artistId));
    }

    public AddFilterGenreId(genreId: number): void {
        if (!this.HasGenre(genreId)) {
            this.genreIds.push(genreId);
            this.Refresh();
        }
    }

    public RemoveFilterGenreId(genreId: number): void {
        if (this.HasGenre(genreId)) {
            _.pull(this.genreIds, genreId);
            this.Refresh();
        }
    }

    public RemoveFilterAllGenres(): void {
        if (0 < this.genreIds.length) {
            this.genreIds = [];
            this.Refresh();
        }
    }

    public AddFilterArtistId(artistId: number): void {
        if (!this.HasArtist(artistId)) {
            this.artistIds.push(artistId);
            this.Refresh();
        }
    }

    public RemoveFilterArtistId(artistId: number): void {
        if (this.HasArtist(artistId)) {
            _.pull(this.artistIds, artistId);
            this.Refresh();
        }
    }

    public RemoveFilterAllArtists(): void {
        if (0 < this.artistIds.length) {
            this.artistIds = [];
            this.Refresh();
        }
    }

    public RemoveAllFilters(): void {
        if (0 < this.genreIds.length || 0 < this.artistIds.length) {
            this.genreIds = [];
            this.artistIds = [];
            this.Refresh();
        }
    }
}
