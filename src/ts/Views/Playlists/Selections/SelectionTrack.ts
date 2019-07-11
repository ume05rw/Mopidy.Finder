import * as _ from 'lodash';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Track from '../../../Models/Tracks/Track';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import ViewBase from '../../Bases/ViewBase';
import { default as SelectionEvents, ISelectionChangedArgs } from '../../Shared/SelectionEvents';

@Component({
    template: `<li class="item w-100"
                    ref="Li" >
    <a href="javascript:void(0)" class="w-100"
        @click="OnClick">
        <div class="product-img">
            <img v-bind:src="((entity.Album) ? entity.Album.GetImageFullUri() : '')" alt="ALbum Image">
        </div>
        <div class="product-info">
            <span class="product-title">
                {{ entity.Name }}
                <span class="pull-right">{{ entity.GetTimeString() }}</span>
            </span>
            <span class="product-description">
                {{ entity.GetAlbumName() }} {{ entity.GetFormattedYearString() }} {{ ' : ' + entity.GetFormattedArtistName() }}
            </span>
        </div>
    </a>
</li>`
})
export default class SelectionTrack extends ViewBase {

    @Prop()
    private entity: Track;

    private OnClick(): void {
        this.$emit(SelectionEvents.SelectionChanged, {
            Selected: true,
            Entity: this.entity
        } as ISelectionChangedArgs<Track>);
    }
}
