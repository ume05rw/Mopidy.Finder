import Component from 'vue-class-component';
import Playlist from '../../Models/Playlists/Playlist';
import ViewBase from '../Bases/ViewBase';
import { ISelectionChangedArgs } from '../Shared/SelectionList';
import PlaylistList from './Lists/Playlists/PlaylistList';
import TrackList from './Lists/Tracks/TrackList';

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-playlists"
                        role="tabpanel"
                        aria-labelledby="playlists-tab">
    <div class="row">
        <playlist-list
            ref="PlaylistList"
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
export default class Playlists extends ViewBase {

    private get PlaylistList(): PlaylistList {
        return this.$refs.PlaylistList as PlaylistList;
    }
    private get TrackList(): TrackList {
        return this.$refs.TrackList as TrackList;
    }

    private OnPlaylistsSelectionChanged(args: ISelectionChangedArgs<Playlist>): void {
        if (args.Selected) {
            this.TrackList.SetPlaylist(args.Entity);
        } else {
            this.TrackList.SetPlaylist(null);
        }
    }
}
