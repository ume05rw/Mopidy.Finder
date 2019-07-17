import Component from 'vue-class-component';
import Playlist from '../../Models/Playlists/Playlist';
import ContentViewBase from '../Bases/ContentViewBase';
import { ISelectionOrderedArgs, ISelectionChangedArgs } from '../Shared/SelectionItem';
import PlaylistList from './Lists/Playlists/PlaylistList';
import TrackList from './Lists/Tracks/TrackList';
import Libraries from '../../Libraries';

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
            ref="TrackList" />
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

    public GetIsPermitLeave(): boolean {

        // プレイリスト画面からの移動可否判定
        const isSaved = this.TrackList.GetIsSavedPlaylistChanges();

        if (!isSaved) {
            Libraries.ShowToast.Warning('Please complete editing.');
        }

        return isSaved;
    }
}
