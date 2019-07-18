import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Libraries from '../../../../Libraries';
import AlbumTracks from '../../../../Models/AlbumTracks/AlbumTracks';
import Playlist from '../../../../Models/Playlists/Playlist';
import Track from '../../../../Models/Tracks/Track';
import Exception from '../../../../Utils/Exception';
import ViewBase from '../../../Bases/ViewBase';
import { ISelectionChangedArgs } from '../../../Shared/SelectionItem';

export interface IPlayOrderedArgs extends ISelectionChangedArgs<AlbumTracks> {
    Track: Track;
}
export interface ICreatePlaylistOrderedArgs {
    AlbumTracks: AlbumTracks;
}
export interface IAddToPlaylistOrderedArgs {
    Playlist: Playlist
    Tracks: Track[];
}

export const SelectionAlbumTracksEvents = {
    PlayOrdered: 'PlayOrdered',
    CreatePlaylistOrdered: 'CreatePlaylistOrdered',
    AddToPlaylistOrdered: 'AddToPlaylistOrdered'
};

@Component({
    template: `<li class="nav-item albumtrack w-100"
                   ref="Li" >
    <div class="card">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title text-nowrap text-truncate">
                {{ entity.GetArtistName() }} {{ (entity.Album.Year) ? '(' + entity.Album.Year + ')' : '' }} : {{ entity.Album.Name }}
            </h3>
            <div class="card-tools">
                <button type="button"
                    class="btn btn-tool"
                    ref="AlbumPlayButton"
                    @click="OnHeaderPlayClicked" >
                    <i class="fa fa-play" />
                </button>
                <button type="button"
                    class="btn btn-tool dropdown-toggle"
                    data-toggle="dropdown"
                    data-offset="-160px, 0"
                    ref="HeaderPlaylistButton">
                    <i class="fa fa-bookmark" />
                </button>
                <div class="dropdown-menu header-dropdown">
                    <div class="inner-header-dorpdown" ref="HeaderDropDownDiv">
                        <a class="dropdown-item"
                            href="javascript:void(0)"
                            @click="OnHeaderNewPlaylistClicked">New Playlist</a>
                        <div class="dropdown-divider"></div>
                        <template v-for="playlist in playlists">
                        <a class="dropdown-item text-truncate"
                            href="javascript:void(0)"
                            v-bind:data-uri="playlist.Uri"
                            @click="OnHeaderPlaylistClicked">{{ playlist.Name }}</a>
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
                        <tr v-bind:data-trackid="track.Id">
                            <td class="tracknum"
                                @click="OnRowClicked">{{ track.TrackNo }}</td>
                            <td class="trackname text-truncate"
                                @click="OnRowClicked">{{ track.Name }}</td>
                            <td class="tracklength"
                                @click="OnRowClicked">{{ track.GetTimeString() }}</td>
                            <td class="trackoperation">
                                <button type="button"
                                    class="btn btn-tool dropdown-toggle"
                                    data-toggle="dropdown"
                                    data-offset="-160px, 0"
                                    ref="RowPlaylistButtons">
                                    <i class="fa fa-bookmark" />
                                </button>
                                <div class="dropdown-menu row-dropdown">
                                    <div class="inner-row-dorpdown" ref="RowDropDownDivs">
                                        <template v-for="playlist in playlists">
                                        <a class="dropdown-item text-truncate"
                                            href="javascript:void(0)"
                                            v-bind:data-uri="playlist.Uri"
                                            v-bind:data-trackid="track.Id"
                                            @click="OnRowPlaylistClicked">{{ playlist.Name }}</a>
                                        </template>
                                    </div>
                                </div>
                            </td>
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
    private get HeaderPlaylistButton(): HTMLButtonElement {
        return this.$refs.HeaderPlaylistButton as HTMLButtonElement;
    }
    private get HeaderDropDownDiv(): HTMLDivElement {
        return this.$refs.HeaderDropDownDiv as HTMLDivElement;
    }
    private get RowPlaylistButtons(): HTMLButtonElement[] {
        return this.$refs.RowPlaylistButtons as HTMLButtonElement[];
    }

    private get RowDropDownDivs(): HTMLDivElement[] {
        return this.$refs.RowDropDownDivs as HTMLDivElement[];
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        Libraries.SetTooltip(this.AlbumPlayButton, 'Play Album');
        Libraries.SetTooltip(this.HeaderPlaylistButton, 'To Playlist');
        Libraries.SlimScroll(this.HeaderDropDownDiv);

        for (let i = 0; i < this.RowPlaylistButtons.length; i++) {
            const elem = this.RowPlaylistButtons[i];
            Libraries.SetTooltip(elem, 'To Playlist');
        }
        for (let i = 0; i < this.RowDropDownDivs.length; i++) {
            const elem = this.RowDropDownDivs[i];
            Libraries.SlimScroll(elem);
        }

        return true;
    }

    private OnHeaderPlayClicked(): void {
        const tracks = Libraries.Enumerable.from(this.entity.Tracks);
        const track = tracks
            .first((e): boolean => e.TrackNo === tracks.min((e2): number => e2.TrackNo));

        const args: IPlayOrderedArgs = {
            Entity: this.entity,
            Track: track,
            Selected: true
        };
        this.$emit(SelectionAlbumTracksEvents.PlayOrdered, args);
    }

    private OnHeaderNewPlaylistClicked(): void {
        const args: ICreatePlaylistOrderedArgs = {
            AlbumTracks: this.entity
        };
        this.$emit(SelectionAlbumTracksEvents.CreatePlaylistOrdered, args);
    }

    private OnHeaderPlaylistClicked(ev: MouseEvent): void {
        const uri = (ev.target as HTMLElement).getAttribute('data-uri');
        const playlist = Libraries.Enumerable.from(this.playlists)
            .firstOrDefault(e => e.Uri === uri);

        if (!playlist)
            Exception.Throw('SelectionAlbumTrack.OnHeaderPlaylistClicked: Uri not found.', uri);

        const args: IAddToPlaylistOrderedArgs = {
            Playlist: playlist,
            Tracks: this.entity.Tracks
        };
        this.$emit(SelectionAlbumTracksEvents.AddToPlaylistOrdered, args);
    }

    private OnRowClicked(args: Event): void {
        const tr = (args.currentTarget as HTMLElement).parentElement;
        const trackIdString = tr.getAttribute('data-trackid');
        if (!trackIdString || trackIdString === '')
            Exception.Throw('SelectionAlbumTrack.OnRowClicked: Track-Id not found.');

        const trackId = parseInt(trackIdString, 10);
        const tracks = Libraries.Enumerable.from(this.entity.Tracks);
        const track = tracks.firstOrDefault((e): boolean => e.Id === trackId);
        if (!track)
            Exception.Throw('SelectionAlbumTrack.OnRowClicked: Track entity not found.');

        const orderedArgs: IPlayOrderedArgs = {
            Entity: this.entity,
            Track: track,
            Selected: true
        };
        this.$emit(SelectionAlbumTracksEvents.PlayOrdered, orderedArgs);
    }

    private OnRowPlaylistClicked(ev: MouseEvent): void {
        const elem = ev.currentTarget as HTMLElement;
        const uri = elem.getAttribute('data-uri');
        const playlist = Libraries.Enumerable.from(this.playlists)
            .firstOrDefault(e => e.Uri === uri);

        if (!playlist)
            Exception.Throw('SelectionAlbumTrack.OnRowPlaylistClicked: Uri not found.', uri);

        const trackIdString = elem.getAttribute('data-trackid');
        if (!trackIdString || trackIdString === '')
            Exception.Throw('SelectionAlbumTrack.OnRowPlaylistClicked: Track-Id not found.');

        const trackId = parseInt(trackIdString, 10)
        const track = Libraries.Enumerable.from(this.entity.Tracks)
            .firstOrDefault(e => e.Id === trackId);
        if (!track)
            Exception.Throw('SelectionAlbumTrack.OnRowPlaylistClicked: Track not found.', uri);

        const args: IAddToPlaylistOrderedArgs = {
            Playlist: playlist,
            Tracks: [ track ]
        };
        this.$emit(SelectionAlbumTracksEvents.AddToPlaylistOrdered, args);
    }
}
