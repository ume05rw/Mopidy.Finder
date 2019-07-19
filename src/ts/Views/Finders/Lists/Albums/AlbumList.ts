import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import AlbumTracks from '../../../../Models/AlbumTracks/AlbumTracks';
import AlbumTracksStore, { IPagenateQueryArgs } from '../../../../Models/AlbumTracks/AlbumTracksStore';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Playlist from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Delay from '../../../../Utils/Delay';
import Exception from '../../../../Utils/Exception';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import { default as SelectionList, SelectionEvents } from '../../../Shared/SelectionList';
import { default as SelectionAlbumTracks, IAddToPlaylistOrderedArgs, ICreatePlaylistOrderedArgs, IPlayOrderedArgs } from './SelectionAlbumTracks';

export const AlbumListEvents = {
    PlaylistUpdated: 'PlaylistUpdated'
};

@Component({
    template: `<div class="col-md-6">
    <div class="card">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title">Albums</h3>
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'Album?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()"/>
            </div>
        </div>
        <div class="card-body list-scrollbox">
            <div class="card-inner-body album-list"
                ref="CardInnerBody">
                <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                    <template v-for="entity in entities">
                        <selection-album-tracks
                            v-bind:playlists="playlists"
                            ref="Items"
                            v-bind:entity="entity"
                            @PlayOrdered="OnPlayOrdered"
                            @CreatePlaylistOrdered="OnCreatePlaylistOrdered"
                            @AddToPlaylistOrdered="OnAddToPlaylistOrdered" />
                    </template>
                    <infinite-loading
                        @infinite="OnInfinite"
                        force-use-infinite-wrapper=".card-inner-body.album-list"
                        ref="InfiniteLoading" />
                </ul>
            </div>
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
    private playlists: Playlist[] = [];

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }
    private get Items(): SelectionAlbumTracks[] {
        return this.$refs.Items as SelectionAlbumTracks[];
    }
    private get CardInnerBody(): HTMLDivElement {
        return this.$refs.CardInnerBody as HTMLDivElement;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = false;
        await super.Initialize();

        // 利便性的にどうなのか、悩む。
        Libraries.SlimScroll(this.CardInnerBody, {
            height: 'calc(100vh - 200px)',
            wheelStep: 20
        });

        // ※$onの中ではプロパティ定義が参照出来ないらしい。
        // ※ハンドラメソッドをthisバインドしてもダメだった。
        // ※やむなく、$refsを直接キャストする。
        this.$on(SelectionEvents.ListUpdated, async (): Promise<boolean> => {
            await Delay.Wait(500);

            const items = this.$refs.Items as SelectionAlbumTracks[];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (!item.GetIsInitialized())
                    item.Initialize();

                if (item.playlists !== this.playlists)
                    item.playlists = this.playlists;
            }

            return true;
        });

        await this.InitPlaylistList();

        return true;
    }

    /**
     * 非表示時にInfiniteLoadingが反応しない現象への対策。
     */
    public LoadIfEmpty(): void {
        if (!this.entities || this.entities.length <= 0)
            this.Refresh();
    }

    public ForceRefresh(): void {
        this.genreIds = [];
        this.artistIds = [];
        this.entities = [];
        this.Refresh();
    }

    public async InitPlaylistList(): Promise<boolean> {
        const store = new PlaylistStore();
        this.playlists = await store.GetPlaylists();

        if (!this.Items)
            return true;

        for (let i = 0; i < this.Items.length; i++)
            this.Items[i].playlists = this.playlists;

        return true;
    }

    private async OnPlayOrdered(args: IPlayOrderedArgs): Promise<boolean> {

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

            (result)
                ? Libraries.ShowToast.Success(`Track [ ${track.Name} ] Started.`)
                : Libraries.ShowToast.Error('Track Play Order Failed.');

            return result;
        } else {
            // TlId未割り当ての場合
            const resultAtls = await this.store.PlayAlbumByTrack(track);

            if (!resultAtls) {
                Libraries.ShowToast.Error('Track Play Order Failed.');

                return false;
            }

            const updatedTracks = Libraries.Enumerable.from(resultAtls.Tracks);

            _.each(albumTracks.Tracks, (track): void => {
                track.TlId = updatedTracks.firstOrDefault((e): boolean => e.Id == track.Id).TlId;
            });

            Libraries.ShowToast.Success(`Track [ ${track.Name} ] Started.`)

            return true;
        }
    }

    private async OnCreatePlaylistOrdered(args: ICreatePlaylistOrderedArgs): Promise<boolean> {
        const store = new PlaylistStore();
        const newPlaylist = await store.AddPlaylistByAlbumTracks(args.AlbumTracks);

        if (!newPlaylist) {
            Libraries.ShowToast.Error('Playlist Create Failed.');

            return false;
        }

        this.$emit(AlbumListEvents.PlaylistUpdated);
        this.InitPlaylistList();
        Libraries.ShowToast.Success(`New Playlist [ ${newPlaylist.Name} ] Created.`);

        return true;
    }

    private async OnAddToPlaylistOrdered(args: IAddToPlaylistOrderedArgs): Promise<boolean> {
        const playlist = args.Playlist;
        if (!playlist.Tracks)
            playlist.Tracks = [];

        for (let i = 0; i < args.Tracks.length; i++) {
            const track = args.Tracks[i];
            playlist.Tracks.push(track);
        }

        const store = new PlaylistStore();
        const result = await store.UpdatePlayllist(playlist);

        if (result === true) {
            this.$emit(AlbumListEvents.PlaylistUpdated);
            this.InitPlaylistList();
            Libraries.ShowToast.Success(`Add ${args.Tracks.length} Track(s) to Playlist [ ${playlist.Name} ]`);
        } else {
            Libraries.ShowToast.Error('Playlist Update Failed.');
        }

        return result;
    }

    protected Refresh(): void {
        super.Refresh();
        this.isEntitiesRefreshed = true;
    }

    // #region "InfiniteLoading"
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
    // #endregion

    // #region "Filters"
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
    // #endregion
}
