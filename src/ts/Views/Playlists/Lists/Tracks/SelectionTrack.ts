import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Track from '../../../../Models/Tracks/Track';
import ViewBase from '../../../Bases/ViewBase';
import { SelectionEvents, ISelectionChangedArgs } from '../../../Shared/SelectionList';

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
        const args: ISelectionChangedArgs<Track> = {
            Selected: true,
            Entity: this.entity
        };
        this.$emit(SelectionEvents.SelectionChanged, args);
    }
}
