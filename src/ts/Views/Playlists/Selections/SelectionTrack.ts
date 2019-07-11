import * as _ from 'lodash';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ITrack from '../../../Models/Mopidies/ITrack';
import PlaylistStore from '../../../Models/Playlists/PlaylistStore';
import ViewBase from '../../Bases/ViewBase';
import { default as SelectionEvents, ISelectionChangedArgs } from '../../Shared/SelectionEvents';

@Component({
    template: `<li class="item w-100"
                    ref="Li" >
    <a href="javascript:void(0)" class="w-100"
        @click="OnClick">
        <div class="product-img">
            <img v-bind:src="albumImage" alt="ALbum Image">
        </div>
        <div class="product-info">
            <span class="product-title">
                {{ trackName }}
                <span class="pull-right">{{ timeString }}</span>
            </span>
            <span class="product-description">
                {{ albumName }} {{ yearString }} {{ (artistNames) ? ' : ' + artistNames : '' }}
            </span>
        </div>
    </a>
</li>`
})
export default class SelectionTrack extends ViewBase {

    @Prop()
    private entity: ITrack;

    @Prop()
    private store: PlaylistStore;

    private trackName: string = '--';
    private timeString: string = '--';
    private yearString: string = '';
    private albumName: string = '--';
    private albumImage: string = '';
    private artistNames: string = '--';

    public constructor() {
        super();
    }

    public async Refresh(): Promise<boolean> {
        if (this.entity.name)
            this.trackName = this.entity.name;

        if (this.entity.length)
            this.timeString = this.GetTimeString(this.entity.length);

        if (this.entity.date) {
            const year = this.GetYear(this.entity.date);
            if (year)
                this.yearString = `(${year})`;
        }

        if (this.entity.album && this.entity.album.name)
            this.albumName = this.entity.album.name;

        if (this.entity.artists && 1 <= this.entity.artists.length) {
            this.artistNames = (this.entity.artists.length === 1)
                ? this.entity.artists[0].name
                : (this.entity.artists[0].name + ' and more...');
        }

        if (this.entity.album) {
            if (this.entity.album.images && 1 <= this.entity.album.images.length) {
                this.albumImage = this.GetImageFullUri(this.entity.album.images[0]);
            } else if (this.entity.album.uri) {
                const imageUri = await this.store.GetImageUri(this.entity.album.uri);
                if (imageUri)
                    this.albumImage = this.GetImageFullUri(imageUri);
            }
        }

        return true;
    }

    private GetYear(date: string): number {
        if (!date)
            return null;

        if (date.length <= 4)
            return parseInt(date, 10);

        return parseInt(date.substr(0, 4), 10);
    }

    private GetTimeString(length: number): string {
        if (!length) {
            return '';
        }

        const minute = Math.floor(length / 60000);
        const second = Math.floor((length % 60000) / 1000);
        const minuteStr = ('00' + minute.toString()).slice(-2);
        const secondStr = ('00' + second.toString()).slice(-2);
        return minuteStr + ':' + secondStr;
    }

    private GetImageFullUri(uri): string {
        return `${location.protocol}//${location.host}${uri}`;
    }

    private OnClick(): void {
        this.$emit(SelectionEvents.SelectionChanged, {
            Selected: true,
            Entity: this.entity
        } as ISelectionChangedArgs<ITrack>);
    }
}
