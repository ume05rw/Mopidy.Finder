import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Playlist from '../../Models/Playlists/Playlist';
import Delay from '../../Utils/Delay';
import Exception from '../../Utils/Exception';
import ContentBase from '../Bases/ContentBase';
import { ContentDetails, default as IContentDetail, IContentDetailArgs, IContentSwipeArgs } from '../Bases/IContentDetail';
import { ISelectionChangedArgs, ISelectionOrderedArgs } from '../Shared/SelectionItem';
import PlaylistList from './Lists/Playlists/PlaylistList';
import TrackList from './Lists/Tracks/TrackList';

export const PlaylistsEvents = {
    PlaylistsUpdated: 'PlaylistsUpdated'
};

@Component({
    template: `<section class="content h-100 tab-pane fade"
    id="tab-playlists"
    role="tabpanel"
    aria-labelledby="nav-playlists">
    <div class="row"
        ref="DetailWrapper">
        <playlist-list
            ref="PlaylistList"
            @SelectionOrdered="OnPlaylistsSelectionOrdered"
            @SelectionChanged="OnPlaylistsSelectionChanged"
            @Swiped="OnSwiped" />
        <track-list
            ref="TrackList"
            @PlaylistDeleted="OnPlaylistDeleted"
            @PlaylistUpdated="OnPlaylistUpdated"
            @Swiped="OnSwiped" />
    </div>
</section>`,
    components: {
        'playlist-list': PlaylistList,
        'track-list': TrackList
    }
})
export default class Playlists extends ContentBase {

    private get PlaylistList(): PlaylistList {
        return this.$refs.PlaylistList as PlaylistList;
    }
    private get TrackList(): TrackList {
        return this.$refs.TrackList as TrackList;
    }

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.details.push(this.PlaylistList);
        this.details.push(this.TrackList);
        this.currentDetail = this.PlaylistList;
        this.detailWrapperElement = this.$refs.DetailWrapper as HTMLElement;

        return true;
    }

    // #region "IContentView"
    protected detailWrapperElement: HTMLElement = null;
    protected details: IContentDetail[] = [];
    protected currentDetail: IContentDetail = null;
    public GetIsPermitLeave(): boolean {
        // プレイリスト画面からの移動可否判定
        const isSaved = this.TrackList.GetIsSavedPlaylistChanges();
        if (!isSaved) {
            Libraries.ShowToast.Warning('Please complete editing.');
        }

        return isSaved;
    }
    public InitContent(): void {
        Delay.Wait(800)
            .then((): void => {
                this.PlaylistList.LoadIfEmpty();
            });
    }
    protected GetContentDetail(detail: ContentDetails): IContentDetail {
        switch (detail) {
            case ContentDetails.Playlists:
                return this.PlaylistList;
            case ContentDetails.PlaylistTracks:
                return this.TrackList;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }
    }
    public async ShowContentDetail(args: IContentDetailArgs): Promise<boolean> {
        await super.ShowContentDetail(args);

        switch (args.Detail) {
            case ContentDetails.Playlists:
                this.PlaylistList.LoadIfEmpty();
                break;
            case ContentDetails.PlaylistTracks:
                this.TrackList.LoadIfEmpty();
                break;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }

        return true;
    }
    protected OnSwiped(args: IContentSwipeArgs): void {
        super.OnSwiped(args);
    }
    // #endregion

    private async OnPlaylistsSelectionOrdered(args: ISelectionOrderedArgs<Playlist>): Promise<boolean> {
        // プレイリスト変更可否判定
        const isSaved = this.TrackList.GetIsSavedPlaylistChanges();
        args.Permitted = isSaved;

        if (!isSaved) {
            Libraries.ShowToast.Warning('Please complete editing.');
        }

        return true;
    }

    private OnPlaylistsSelectionChanged(args: ISelectionChangedArgs<Playlist>): void {
        if (args.Selected) {
            this.TrackList.SetPlaylist(args.Entity);
        } else {
            this.TrackList.SetPlaylist(null);
        }
    }

    private OnPlaylistCreated(): void {
        this.$emit(PlaylistsEvents.PlaylistsUpdated);
    }

    private OnPlaylistDeleted(): void {
        this.PlaylistList.RefreshPlaylist();
        this.$emit(PlaylistsEvents.PlaylistsUpdated);
    }

    private OnPlaylistUpdated(): void {
        this.PlaylistList.RefreshPlaylist();
        this.$emit(PlaylistsEvents.PlaylistsUpdated);
    }

    public RefreshPlaylist(): void {
        this.PlaylistList.RefreshPlaylist();
    }
}
