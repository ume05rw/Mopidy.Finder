import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Playlist from '../../Models/Playlists/Playlist';
import ContentViewBase from '../Bases/ContentViewBase';
import { ISelectionChangedArgs, ISelectionOrderedArgs } from '../Shared/SelectionItem';
import PlaylistList from './Lists/Playlists/PlaylistList';
import TrackList from './Lists/Tracks/TrackList';
import Delay from '../../Utils/Delay';

export const PlaylistsEvents = {
    PlaylistsUpdated: 'PlaylistsUpdated'
};

@Component({
    template: `<section class="content h-100 tab-pane fade"
    id="tab-playlists"
    role="tabpanel"
    aria-labelledby="playlists-tab">
    <div class="row">
        <playlist-list
            ref="PlaylistList"
            @SelectionOrdered="OnPlaylistsSelectionOrdered"
            @SelectionChanged="OnPlaylistsSelectionChanged" />
        <track-list
            ref="TrackList"
            @PlaylistDeleted="OnPlaylistDeleted"
            @PlaylistUpdated="OnPlaylistUpdated" />
    </div>
</section>`,
    components: {
        'playlist-list': PlaylistList,
        'track-list': TrackList
    }
})
export default class Playlists extends ContentViewBase {

    private get PlaylistList(): PlaylistList {
        return this.$refs.PlaylistList as PlaylistList;
    }
    private get TrackList(): TrackList {
        return this.$refs.TrackList as TrackList;
    }

    // #region "IContentView"
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
