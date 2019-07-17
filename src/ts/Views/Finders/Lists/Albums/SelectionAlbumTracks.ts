import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Libraries from '../../../../Libraries';
import AlbumTracks from '../../../../Models/AlbumTracks/AlbumTracks';
import Playlist from '../../../../Models/Playlists/Playlist';
import Track from '../../../../Models/Tracks/Track';
import ViewBase from '../../../Bases/ViewBase';
import { ISelectionChangedArgs } from '../../../Shared/SelectionItem';

export interface IAlbumTracksSelectedArgs extends ISelectionChangedArgs<AlbumTracks> {
    Track: Track;
}
export const SelectionAlbumEvents = {
    AlbumTracksSelected: 'AlbumTracksSelected'
};

@Component({
    template: `<li class="nav-item w-100 albumtrack"
                   ref="Li" >
    <div class="card w-100">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title text-nowrap text-truncate">
                {{ entity.GetArtistName() }} {{ (entity.Album.Year) ? '(' + entity.Album.Year + ')' : '' }} : {{ entity.Album.Name }}
            </h3>
            <div class="card-tools">
                <button type="button"
                    class="btn btn-tool"
                    ref="AlbumPlayButton"
                    @click="OnClickAlbumPlay" >
                    <i class="fa fa-play" />
                </button>
                <button type="button"
                    class="btn btn-tool dropdown-toggle"
                    data-toggle="dropdown">
                    <i class="fa fa-bookmark" />
                </button>
                <div class="dropdown-menu">
                    <div class="inner-dorpdown" ref="DropDownMenuDiv">
                        <a class="dropdown-item"
                            href="javascript:void(0)"
                            @click="">New Playlist</a>
                        <div class="dropdown-divider"></div>
                        <template v-for="playlist in playlists">
                        <a class="dropdown-item text-truncate"
                            href="javascript:void(0)"
                            v-bind:data-uri="playlist.Uri"
                            @click="">{{ playlist.Name }}</a>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body row">
            <div class="col-md-4">
                <img class="albumart" v-bind:src="entity.Album.GetImageFullUri()" />
            </div>
            <div class="col-md-8">
                <table class="table table-sm table-hover tracks">
                    <tbody>
                        <template v-for="track in entity.Tracks">
                        <tr @click="OnClickTrack"
                            v-bind:data-trackid="track.Id">
                            <td class="tracknum">{{ track.TrackNo }}</td>
                            <td class="trackname text-truncate">{{ track.Name }}</td>
                            <td class="tracklength">{{ track.GetTimeString() }}</td>
                        </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</li>`
})
export default class SelectionAlbumTracks extends ViewBase {

    @Prop()
    private entity: AlbumTracks;

    @Prop()
    public playlists: Playlist[];

    private get AlbumPlayButton(): HTMLButtonElement {
        return this.$refs.AlbumPlayButton as HTMLButtonElement;
    }
    private get DropDownMenuDiv(): HTMLDivElement {
        return this.$refs.DropDownMenuDiv as HTMLDivElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        Libraries.SetTooltip(this.AlbumPlayButton, 'Play Album');
        Libraries.SlimScroll(this.DropDownMenuDiv);

        return true;
    }

    private OnClickAlbumPlay(): void {
        const tracks = Libraries.Enumerable.from(this.entity.Tracks);
        const track = tracks
            .first((e): boolean => e.TrackNo === tracks.min((e2): number => e2.TrackNo));

        const selectionArgs: IAlbumTracksSelectedArgs = {
            Entity: this.entity,
            Track: track,
            Selected: true
        };
        this.$emit(SelectionAlbumEvents.AlbumTracksSelected, selectionArgs);
    }

    private OnClickTrack(args: Event): void {
        const tr = (args.target as HTMLElement).parentElement;
        const trackId = parseInt(tr.getAttribute('data-trackid'), 10);
        const tracks = Libraries.Enumerable.from(this.entity.Tracks);
        const track = tracks.first((e): boolean => e.Id === trackId);

        const selectionArgs: IAlbumTracksSelectedArgs = {
            Entity: this.entity,
            Track: track,
            Selected: true
        };

        this.$emit(SelectionAlbumEvents.AlbumTracksSelected, selectionArgs);
    }
}
