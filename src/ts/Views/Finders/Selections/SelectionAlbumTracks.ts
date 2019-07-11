import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ViewBase from '../../Bases/ViewBase';
import AlbumTracks from '../../../Models/AlbumTracks/AlbumTracks';
import Libraries from '../../../Libraries';
import { ISelectionChangedArgs } from '../../Shared/SelectionEvents';
import Track from '../../../Models/Tracks/Track';

export interface IAlbumTracksSelectedArgs extends ISelectionChangedArgs<AlbumTracks> {
    Track: Track;
}
export const SelectionAlbumEvents = {
    AlbumTracksSelected: 'AlbumTracksSelected'
};

@Component({
    template: `<li class="nav-item w-100"
                   ref="Li" >
    <div class="card w-100">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title text-nowrap text-truncate">
                {{ entity.GetArtistName() }} {{ (entity.Album.Year) ? '(' + entity.Album.Year + ')' : '' }} : {{ entity.Album.Name }}
            </h3>
            <div class="card-tools">
                <button type="button"
                        class="btn btn-tool"
                        @click="OnClickAlbumPlay" >
                    <i class="fa fa-play" />
                </button>
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

    private OnClickAlbumPlay(): void {
        var tracks = Libraries.Enumerable.from(this.entity.Tracks);
        var track = tracks.first(e => e.TrackNo === tracks.min(e2 => e2.TrackNo));

        this.$emit(SelectionAlbumEvents.AlbumTracksSelected, {
            Entity: this.entity,
            Track: track
        } as IAlbumTracksSelectedArgs);
    }

    private OnClickTrack(args: Event): void {
        var tr = (args.target as HTMLElement).parentElement;
        var trackId = parseInt(tr.getAttribute('data-trackid'), 10);
        var tracks = Libraries.Enumerable.from(this.entity.Tracks);
        var track = tracks.first(e => e.Id === trackId);

        this.$emit(SelectionAlbumEvents.AlbumTracksSelected, {
            Entity: this.entity,
            Track: track
        } as IAlbumTracksSelectedArgs);
    }
}
