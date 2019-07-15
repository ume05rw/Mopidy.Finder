import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import AlbumTracks from '../../../../Models/AlbumTracks/AlbumTracks';
import AlbumTracksStore, { IPagenateQueryArgs } from '../../../../Models/AlbumTracks/AlbumTracksStore';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Exception from '../../../../Utils/Exception';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import SelectionList from '../../../Shared/SelectionList';
import { default as SelectionAlbumTracks, IAlbumTracksSelectedArgs } from './SelectionAlbumTracks';

@Component({
    template: `<div class="col-md-6">
    <div class="card">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">Albums</h3>
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'Album?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()"/>
            </div>
        </div>
        <div class="card-body list-scrollable album-list">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                <template v-for="entity in entities">
                    <selection-album-tracks
                        ref="AlbumTracks"
                        v-bind:entity="entity"
                        @AlbumTracksSelected="OnAlbumTracksSelected" />
                </template>
                <infinite-loading
                    @infinite="OnInfinite"
                    force-use-infinite-wrapper=".list-scrollable.album-list"
                    ref="InfiniteLoading" />
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'filter-textbox': Filterbox,
        'selection-album-tracks': SelectionAlbumTracks,
        'infinite-loading': InfiniteLoading
    }
})
export default class AlbumList extends SelectionList<AlbumTracks, AlbumTracksStore> {

    protected store: AlbumTracksStore = new AlbumTracksStore();
    protected entities: AlbumTracks[] = [];

    private isEntitiesRefreshed: boolean = false;
    private genreIds: number[] = [];
    private artistIds: number[] = [];

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = false;
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

    protected async GetPagenatedList(): Promise<IPagenatedResult<AlbumTracks>> {
        const args: IPagenateQueryArgs = {
            GenreIds: this.genreIds,
            ArtistIds: this.artistIds,
            FilterText: this.Filterbox.GetText(),
            Page: this.Page
        };

        return await this.store.GetList(args);
    }

    private async OnAlbumTracksSelected(args: IAlbumTracksSelectedArgs): Promise<boolean> {

        if (this.isEntitiesRefreshed) {
            await this.store.ClearList();

            _.each(this.entities, (entity): void => {
                _.each(entity.Tracks, (track): void => {
                    track.TlId = null;
                });
            });
            this.isEntitiesRefreshed = false;
        }

        const albumTracks = args.Entity;
        if (!albumTracks)
            Exception.Throw('AlbumTracks Not Found', args);

        const track = args.Track;
        if (!track)
            Exception.Throw('Track Not Found', args);

        const isAllTracksRegistered = Libraries.Enumerable.from(albumTracks.Tracks)
            .all((e): boolean => e.TlId !== null);

        if (isAllTracksRegistered) {
            // TlId割り当て済みの場合
            const result = await this.store.PlayAlbumByTlId(track.TlId);

            return result;
        } else {
            // TlId未割り当ての場合
            const resultAtls = await this.store.PlayAlbumByTrack(track);
            const updatedTracks = Libraries.Enumerable.from(resultAtls.Tracks);

            _.each(albumTracks.Tracks, (track): void => {
                track.TlId = updatedTracks.firstOrDefault((e): boolean => e.Id == track.Id).TlId;
            });

            return true;
        }
    }

    protected Refresh(): void {
        super.Refresh();
        this.isEntitiesRefreshed = true;
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
