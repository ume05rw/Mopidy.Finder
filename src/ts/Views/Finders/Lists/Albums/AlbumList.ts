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
import Dump from '../../../../Utils/Dump';
import Exception from '../../../../Utils/Exception';
import { Contents } from '../../../Bases/IContent';
import { ContentDetailEvents, ContentDetails, IContentSwipeArgs, SwipeDirection } from '../../../Bases/IContentDetail';
import { default as SelectionListBase, SelectionEvents } from '../../../Bases/SelectionListBase';
import { SwipeEvents } from '../../../Events/HammerEvents';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import { default as SelectionAlbumTracks, IAddToPlaylistOrderedArgs, ICreatePlaylistOrderedArgs, IPlayOrderedArgs } from './SelectionAlbumTracks';

export const AlbumListEvents = {
    PlaylistUpdated: 'PlaylistUpdated'
};

@Component({
    template: `<div class="col-lg-6">
    <div class="card">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title">
                <i class="fa fa-music" />
                Album Tracks
            </h3>
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'Album?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()"/>
            </div>
        </div>
        <div class="card-body listbox">
            <div class="outer-scrollbox">
                <div class="inner-scrollbox album-list">
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
                            force-use-infinite-wrapper=".inner-scrollbox.album-list"
                            ref="InfiniteLoading" />
                    </ul>
                </div>
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
export default class AlbumList extends SelectionListBase<AlbumTracks, AlbumTracksStore> {

    protected readonly tabId: string = 'subtab-albumtracks';
    protected readonly linkId: string = 'nav-albumtracks';
    protected store: AlbumTracksStore = new AlbumTracksStore();
    protected entities: AlbumTracks[] = [];

    private isEntitiesRefreshed: boolean = false;
    private genreIds: number[] = [];
    private artistIds: number[] = [];
    private playlists: Playlist[] = [];
    private swipeDetector: HammerManager;

    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }
    private get Items(): SelectionAlbumTracks[] {
        return this.$refs.Items as SelectionAlbumTracks[];
    }

    public async Initialize(): Promise<boolean> {
        Dump.Log('Finder.AlbumList.Initialize: Start.');
        super.Initialize();

        this.swipeDetector = new Libraries.Hammer(this.$el as HTMLElement);
        this.swipeDetector.get('swipe').set({
            direction: Libraries.Hammer.DIRECTION_HORIZONTAL
        });
        this.swipeDetector.on(SwipeEvents.Left, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: null,
                Direction: SwipeDirection.Left
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        this.swipeDetector.on(SwipeEvents.Right, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: ContentDetails.Artists,
                Direction: SwipeDirection.Right
            };
            this.$emit(ContentDetailEvents.Swiped, args);
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

                if (item.GetPlaylists() !== this.playlists)
                    item.SetPlaylists(this.playlists);
            }

            return true;
        });

        await this.InitPlaylistList();
        Dump.Log('Finder.AlbumList.Initialize: End.');

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
            this.Items[i].SetPlaylists(this.playlists);

        return true;
    }

    private async OnPlayOrdered(args: IPlayOrderedArgs): Promise<boolean> {

        const orderedAlbumTrack = Libraries.Enumerable.from(this.entities)
            .where((e): boolean => 0 <= _.indexOf(e.Tracks, args.Track))
            .firstOrDefault();

        if (!orderedAlbumTrack)
            Exception.Throw('AlbumTracks Not Found.', { args: args, entities: this.entities });

        let exists = false;
        _.each(this.entities, (entity): void => {
            if (this.isEntitiesRefreshed !== true && entity == orderedAlbumTrack)
                return;

            _.each(entity.Tracks, (track): void => {
                if (track.TlId !== null && track.TlId !== undefined) {
                    exists = true;
                    track.TlId = null;
                }
            });
        });

        if (this.isEntitiesRefreshed || exists !== false)
            await this.store.ClearList();

        this.isEntitiesRefreshed = false;

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
                ? Libraries.ShowToast.Success(`Track [ ${track.Name} ] Started!`)
                : Libraries.ShowToast.Error('Track Play Order Failed...');

            return result;
        } else {
            // TlId未割り当ての場合
            const resultAtls = await this.store.PlayAlbumByTrack(track);

            if (!resultAtls) {
                Libraries.ShowToast.Error('Track Play Order Failed...');

                return false;
            }

            const updatedTracks = Libraries.Enumerable.from(resultAtls.Tracks);

            _.each(albumTracks.Tracks, (track): void => {
                track.TlId = updatedTracks.firstOrDefault((e): boolean => e.Id == track.Id).TlId;
            });

            Libraries.ShowToast.Success(`Track [ ${track.Name} ] Started!`)

            return true;
        }
    }

    private async OnCreatePlaylistOrdered(args: ICreatePlaylistOrderedArgs): Promise<boolean> {
        const store = new PlaylistStore();
        const newPlaylist = await store.AddPlaylistByAlbumTracks(args.AlbumTracks);

        if (!newPlaylist) {
            Libraries.ShowToast.Error('Playlist Create Failed...');

            return false;
        }

        this.$emit(AlbumListEvents.PlaylistUpdated);
        this.InitPlaylistList();
        Libraries.ShowToast.Success(`New Playlist [ ${newPlaylist.Name} ] Created!`);

        return true;
    }

    private async OnAddToPlaylistOrdered(args: IAddToPlaylistOrderedArgs): Promise<boolean> {
        // 現在のトラックを取得する。
        const store = new PlaylistStore();
        const result = await store.AppendTracks(args.Playlist, args.Tracks);

        if (result === true) {
            this.$emit(AlbumListEvents.PlaylistUpdated);
            this.InitPlaylistList();
            Libraries.ShowToast.Success(`Add ${args.Tracks.length} Track(s) to [ ${args.Playlist.Name} ]`);
        } else {
            Libraries.ShowToast.Error('Playlist Update Failed...');
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
