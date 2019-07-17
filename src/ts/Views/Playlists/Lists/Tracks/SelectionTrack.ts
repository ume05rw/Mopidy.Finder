import * as _ from 'lodash';
import Sortable from 'sortablejs/modular/sortable.complete.esm';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Libraries from '../../../../Libraries';
import Track from '../../../../Models/Tracks/Track';
import { Animation, default as Animate, Speed } from '../../../../Utils/Animate';
import Delay from '../../../../Utils/Delay';
import ViewBase from '../../../Bases/ViewBase';
import { ISelectionChangedArgs } from '../../../Shared/SelectionItem';
import { SelectionEvents } from '../../../Shared/SelectionList';

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
    v-bind:data-uri="entity.Uri"
    ref="Li"
    @click="OnClickRow">
    <div class="product-img ml-2">
        <img v-bind:src="entity.GetAlbumImageFullUri()" alt="ALbum Image">
    </div>
    <div class="product-info">
        <span class="product-title pl-2">
            {{ entity.GetDisplayName() }}
            <div class="btn-group pull-right mr-2 editmode-buttons">
                <button
                    class="btn btn-sm btn-outline-dark"
                    @click="OnClickDelete"
                    ref="DeleteButton" >
                    <i class="fa fa-trash" />
                </button>
            </div>
            <span class="pull-right length mr-2">{{ entity.GetTimeString() }}</span>
        </span>
        <span class="product-description pl-2">{{ GetDetailString() }}</span>
    </div>
</li>`
})
export default class SelectionTrack extends ViewBase {

    private static readonly LiClasses = 'item w-100 track-row ';

    @Prop()
    private entity: Track;

    public get Entity(): Track {
        return this.entity;
    }

    private selected: boolean = false;
    private liClasses: string = SelectionTrack.LiClasses;
    private isDeleting: boolean = false;
    private deletingClasses = Animate.GetClassString(Animation.FadeOutRight, Speed.Faster);

    public async Initialize(): Promise<boolean> {

        if (!this.GetIsInitialized())
            Libraries.SetTooltip(this.$refs.DeleteButton as HTMLElement, 'Delete');

        await super.Initialize();

        return true;
    }

    private GetDetailString(): string {
        const albumName = this.entity.GetAlbumName();
        const artistsName = this.entity.GetFormattedArtistsName();
        const year = this.entity.GetFormattedYearString();
        const yearString = (year === '')
            ? ''
            : ' ' + year

        return `${albumName}${yearString} : ${artistsName}`;
    }

    private SetLiClasses(): void {
        this.liClasses = SelectionTrack.LiClasses
            + ((this.selected)
                ? 'selected '
                : '');

        if (this.isDeleting === true)
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

    private OnClickDelete(ev: MouseEvent): void {
        //console.log('SelectionTrack.OnClickDelete');
        const args: ITrackDeleteOrderedArgs = {
            Entity: this.entity,
            View: this
        };
        this.$emit(TrackSelectionEvents.DeleteOrdered, args);
        ev.preventDefault();
        ev.stopPropagation();
    }

    public async DeleteTrack(): Promise<boolean> {
        //console.log('SelectionTrack.DeleteTrack');
        this.isDeleting = true;
        this.SetLiClasses();
        await Delay.Wait(600);

        return true;
    }

    public GetIsSelected(): boolean {
        return this.selected;
    }

    public Select(): void {
        //console.log('SelectionTrack.Select');
        if (!this.selected) {
            this.selected = true;
            this.SetLiClasses();
        }
    }

    public Deselect(): void {
        //console.log('SelectionTrack.Deselect');
        if (this.selected) {
            this.selected = false;
            this.SetLiClasses();
        }
        try {
            // マルチセレクト有効時はSortableに選択解除を通知する必要がある。
            Sortable.utils.deselect(this.$el as HTMLElement);
        } catch (e) {
            // 握りつぶす。
        }
    }

    public Reset(): void {
        //console.log('SelectionTrack.Reset');
        this.isDeleting = false;
        this.selected = false;
        this.SetLiClasses();
        try {
            // マルチセレクト有効時はSortableに選択解除を通知する必要がある。
            Sortable.utils.deselect(this.$el as HTMLElement);
        } catch (e) {
            // 握りつぶす。
        }
    }
}
