import * as _ from 'lodash';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Track from '../../../../Models/Tracks/Track';
import ViewBase from '../../../Bases/ViewBase';
import { ISelectionChangedArgs, SelectionEvents } from '../../../Shared/SelectionList';
import { default as Animate, Animation, Speed }from '../../../../Utils/Animate';
import Delay from '../../../../Utils/Delay';

export const TrackSelectionEvents = _.extend(_.clone(SelectionEvents), {
    DeleteOrdered: 'DeleteOrdered'
});

export interface ITrackDeleteOrderedArgs {
    Entity: Track;
    View: SelectionTrack;
}

export interface ITrackSelectionChangedArgs extends ISelectionChangedArgs<Track> {
    View: SelectionTrack;
    EnableShifKey: boolean;
    EnableCtrkey: boolean;
}

@Component({
    template: `<li v-bind:class="liClasses"
    ref="Li"
    @click="OnClickRow">
    <div class="product-img ml-2">
        <img v-bind:src="((entity.Album) ? entity.Album.GetImageFullUri() : '')" alt="ALbum Image">
    </div>
    <div class="product-info">
        <span class="product-title pl-2">
            {{ entity.Name }}
            <div class="btn-group pull-right mr-2 editmode-buttons">
                <button
                    class="btn btn-sm btn-outline-dark"
                    @click="OnClickDelete"
                    ref="ButtonCollaplse" >
                    <i class="fa fa-minus-circle" />
                </button>
            </div>
            <span class="pull-right length mr-2">{{ entity.GetTimeString() }}</span>
        </span>
        <span class="product-description pl-2">
            {{ entity.GetAlbumName() }} {{ entity.GetFormattedYearString() }} {{ ' : ' + entity.GetFormattedArtistName() }}
        </span>
    </div>
</li>`
})
export default class SelectionTrack extends ViewBase {

    private static readonly LiClasses = 'item w-100 track-row ';

    @Prop()
    private entity: Track;

    private selected: boolean = false;
    private liClasses: string = SelectionTrack.LiClasses;
    private isDeleting: boolean = false;
    private deletingClasses = Animate.GetClassString(Animation.FadeOutRight, Speed.Faster);
    private SetLiClasses(): void {
        this.liClasses = SelectionTrack.LiClasses
            + (this.selected ? 'selected ' : '');

        if (this.isDeleting)
            this.liClasses += this.deletingClasses;

        this.$forceUpdate();
    }

    private OnClickRow(ev: MouseEvent): void {
        const args: ITrackSelectionChangedArgs = {
            Selected: true,
            Entity: this.entity,
            View: this,
            EnableShifKey: ev.shiftKey,
            EnableCtrkey: ev.ctrlKey
        };
        this.$emit(TrackSelectionEvents.SelectionChanged, args);
    }

    private OnClickDelete(): void {
        const args: ITrackDeleteOrderedArgs = {
            Entity: this.entity,
            View: this
        };
        this.$emit(TrackSelectionEvents.DeleteOrdered, args);
    }

    public async Deltete(): Promise<boolean> {
        this.isDeleting = true;
        this.SetLiClasses();
        await Delay.Wait(600);

        return true;
    }

    public GetIsSelected(): boolean {
        return this.selected;
    }

    public Select(): void {
        if (!this.selected) {
            this.selected = true;
            this.SetLiClasses();
        }
    }

    public Deselect(): void {
        if (this.selected) {
            this.selected = false;
            this.SetLiClasses();
        }
    }
}
