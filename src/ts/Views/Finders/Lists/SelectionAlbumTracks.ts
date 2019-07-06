import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ViewBase from '../../Bases/ViewBase';
import AlbumTracks from '../../../Models/AlbumTracks/AlbumTracks';

@Component({
    template: `<li class="nav-item w-100"
                   ref="Li" >
    <div class="card w-100">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title">{{ entity.Artist.Name }}: {{ entity.Album.Name }} {{ (entity.Album.Year) ? '/' + entity.Album.Year : '' }}</h3>
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
                <table class="table table-hover">
                    <tbody>
                    <template v-for="track in entity.Tracks">
                        <tr @click="OnClickTrack">
                            <td>{{ track.TrackNo }}</td>
                            <td>{{ track.Name }}</td>
                            <td>{{ track.GetTimeString() }}</td>
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

    }

    private OnClickTrack(): void {

    }
}
