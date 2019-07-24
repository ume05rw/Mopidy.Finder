import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Playlist from '../../Models/Playlists/Playlist';
import ContentBase from '../Bases/ContentBase';
import { ISelectionChangedArgs, ISelectionOrderedArgs } from '../Shared/SelectionItem';
import PlaylistList from './Lists/Playlists/PlaylistList';
import TrackList from './Lists/Tracks/TrackList';
import Delay from '../../Utils/Delay';
import { default as IContentDetail, ContentDetails, IContentDetailArgs, IContentSwipeArgs } from '../Bases/IContentDetail';
import Exception from '../../Utils/Exception';
import Dump from '../../Utils/Dump';

export const PlaylistsEvents = {
    PlaylistsUpdated: 'PlaylistsUpdated'
};

@Component({
    template: `<section class="content h-100 tab-pane fade"
    id="tab-playlists"
    role="tabpanel"
    aria-labelledby="nav-playlists">
    <div class="row">
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

        return true;
    }

    // #region "IContentView"
    protected details: IContentDetail[] = [];
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
    public ShowContentDetail(args: IContentDetailArgs): void {
        switch (args.Detail) {
            case ContentDetails.Playlists:
                this.HideAllDetails();
                this.PlaylistList.Show();
                this.PlaylistList.LoadIfEmpty();
                break;
            case ContentDetails.PlaylistTracks:
                this.HideAllDetails();
                this.TrackList.Show();
                this.TrackList.LoadIfEmpty();
                break;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }
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
