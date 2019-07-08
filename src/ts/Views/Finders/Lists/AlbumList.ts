import * as _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import AlbumTracks from '../../../Models/AlbumTracks/AlbumTracks';
import AlbumTracksStore from '../../../Models/AlbumTracks/AlbumTracksStore';
import ViewBase from '../../Bases/ViewBase';
import { Events, ITrackSelected } from '../../Events/FinderEvents';
import SelectionAlbumTracks from './SelectionAlbumTracks';
import Libraries from '../../../Libraries';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-6">
    <div class="card">
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
                        @TrackSelected="OnTrackSelected" />
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

    private isEntitiesRefreshed: boolean = false;
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

    private async OnTrackSelected(args: ITrackSelected): Promise<boolean> {

        if (this.isEntitiesRefreshed) {
            await this.store.ClearList();

            _.each(this.entities, (entity) => {
                _.each(entity.Tracks, (track) => {
                    track.TlId = null;
                });
            });
            this.isEntitiesRefreshed = false;
        }

        var albumTracks = Libraries.Enumerable.from(this.entities)
            .firstOrDefault(e => e.Album.Id === args.AlbumId);

        if (!albumTracks) {
            console.error('AlbumTracks Not Found: AlbumId=' + args.AlbumId);
            return false;
        }

        var tracks = Libraries.Enumerable.from(albumTracks.Tracks);
        var track = tracks.firstOrDefault(e => e.Id === args.TrackId);

        if (!track) {
            console.error('Track Not Found: TrackId=' + args.TrackId);
            return false;
        }

        var isAllTracksRegistered = tracks.all(e => e.TlId !== null);

        if (isAllTracksRegistered) {
            // TlId割り当て済みの場合
            var result = await this.store.PlayAlbumByTlId(track.TlId);
            return result;
        } else {
            // TlId未割り当ての場合
            var resultAtls = await this.store.PlayAlbumByTrack(track);
            var updatedTracks = Libraries.Enumerable.from(resultAtls.Tracks);

            _.each(albumTracks.Tracks, (track) => {
                track.TlId = updatedTracks.firstOrDefault(e => e.Id == track.Id).TlId;
            });

            return true;
        }
    }

    private Refresh(): void {
        this.page = 1;
        this.entities = [];
        this.isEntitiesRefreshed = true;
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
