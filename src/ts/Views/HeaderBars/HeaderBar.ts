import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';
import { IContentArgs, Contents } from '../Bases/IContent';
import Exception from '../../Utils/Exception';
import Libraries from '../../Libraries';
import { ContentDetails, IContentDetailArgs } from '../Bases/IContentDetail';
import Dump from '../../Utils/Dump';

export const HeaderBarEvents = {
    DetailOrdered: 'DetailOrdered'
};

@Component({
    template: `<nav class="main-header navbar navbar-expand border-bottom">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="javascript:void(0)">
                <i class="fa fa-bars" />
            </a>
        </li>
        <li class="nav-item">
            <h3>{{ title }}</h3>
        </li>
    </ul>
    <ul class="navbar-nav ml-auto">
        <li class="nav-item d-md-none"
            ref="MenuGenres">
            <a class="nav-link"
                @click="OnGenresClicked" >
                <i class="fa fa-tags" />
            </a>
        </li>
        <li class="nav-item d-md-none"
            ref="MenuArtists">
            <a class="nav-link"
                @click="OnArtistsClicked" >
                <i class="fa fa-users" />
            </a>
        </li>
        <li class="nav-item d-md-none"
            ref="MenuAlbumTracks">
            <a class="nav-link"
                @click="OnAlbumTracksClicked" >
                <i class="fa fa-music" />
            </a>
        </li>
        <li class="nav-item d-md-none"
            ref="MenuPlaylists">
            <a class="nav-link"
                @click="OnPlaylistsClicked" >
                <i class="fa fa-list-ul" />
            </a>
        </li>
        <li class="nav-item d-md-none"
            ref="MenuPlaylistTracks">
            <a class="nav-link"
                @click="OnPlaylistTracksClicked" >
                <i class="fa fa-music" />
            </a>
        </li>

        <li class="nav-item d-md-none"
            ref="MenuMopidy">
            <a class="nav-link"
                @click="OnMopidyClicked" >
                <i class="fa fa-wifi" />
            </a>
        </li>
        <li class="nav-item d-md-none"
            ref="MenuDb">
            <a class="nav-link"
                @click="OnDbClicked" >
                <i class="fa fa-database" />
            </a>
        </li>
        <li class="nav-item d-md-none"
            ref="MenuScanProgress">
            <a class="nav-link"
                @click="OnScanProgressClicked" >
                <i class="fa fa-rocket" />
            </a>
        </li>
    </ul>
</nav>`
})
export default class HeaderBar extends ViewBase {
    private title: string = 'Mopidy.Finder';
    private currentContent: Contents = null;

    private readonly displayNone: string = 'd-none';
    private buttons: HTMLElement[] = [];

    private get MenuGenres(): HTMLElement {
        return this.$refs.MenuGenres as HTMLElement
    }
    private get MenuArtists(): HTMLElement {
        return this.$refs.MenuArtists as HTMLElement
    }
    private get MenuAlbumTracks(): HTMLElement {
        return this.$refs.MenuAlbumTracks as HTMLElement
    }
    private get MenuPlaylists(): HTMLElement {
        return this.$refs.MenuPlaylists as HTMLElement
    }
    private get MenuPlaylistTracks(): HTMLElement {
        return this.$refs.MenuPlaylistTracks as HTMLElement
    }
    private get MenuMopidy(): HTMLElement {
        return this.$refs.MenuMopidy as HTMLElement
    }
    private get MenuDb(): HTMLElement {
        return this.$refs.MenuDb as HTMLElement
    }
    private get MenuScanProgress(): HTMLElement {
        return this.$refs.MenuScanProgress as HTMLElement
    }

    public async Initialize(): Promise<boolean> {
        Dump.Log('HeaderBar.Initialize: Start.');
        await super.Initialize();

        this.buttons.push(this.MenuGenres);
        this.buttons.push(this.MenuArtists);
        this.buttons.push(this.MenuAlbumTracks);
        this.buttons.push(this.MenuPlaylists);
        this.buttons.push(this.MenuPlaylistTracks);
        this.buttons.push(this.MenuMopidy);
        this.buttons.push(this.MenuDb);
        this.buttons.push(this.MenuScanProgress);

        Libraries.SetTooltip(this.MenuGenres, 'Genres');
        Libraries.SetTooltip(this.MenuArtists, 'Artists');
        Libraries.SetTooltip(this.MenuAlbumTracks, 'Album Tracks');
        Libraries.SetTooltip(this.MenuPlaylists, 'Playlists');
        Libraries.SetTooltip(this.MenuPlaylistTracks, 'Playlist Tracks');
        Libraries.SetTooltip(this.MenuMopidy, 'Set Mopidy');
        Libraries.SetTooltip(this.MenuDb, 'Database');
        Libraries.SetTooltip(this.MenuScanProgress, 'Scan Progress');

        Dump.Log('HeaderBar.Initialize: End.');
        return true;
    }

    private AllButtonToHide(): void {
        for (let i = 0; i < this.buttons.length; i++)
            if (!this.buttons[i].classList.contains(this.displayNone))
                this.buttons[i].classList.add(this.displayNone);
    }

    public SetHeader(args: IContentArgs): void {
        this.currentContent = args.Content;
        this.title = args.Content.toString();

        this.AllButtonToHide();

        switch (this.currentContent) {
            case Contents.Finder:
                if (this.MenuGenres.classList.contains(this.displayNone))
                    this.MenuGenres.classList.remove(this.displayNone);
                if (this.MenuArtists.classList.contains(this.displayNone))
                    this.MenuArtists.classList.remove(this.displayNone);
                if (this.MenuAlbumTracks.classList.contains(this.displayNone))
                    this.MenuAlbumTracks.classList.remove(this.displayNone);
                break;
            case Contents.Playlists:
                if (this.MenuPlaylists.classList.contains(this.displayNone))
                    this.MenuPlaylists.classList.remove(this.displayNone);
                if (this.MenuPlaylistTracks.classList.contains(this.displayNone))
                    this.MenuPlaylistTracks.classList.remove(this.displayNone);
                break;
            case Contents.Settings:
                if (this.MenuMopidy.classList.contains(this.displayNone))
                    this.MenuMopidy.classList.remove(this.displayNone);
                if (this.MenuDb.classList.contains(this.displayNone))
                    this.MenuDb.classList.remove(this.displayNone);
                if (this.MenuScanProgress.classList.contains(this.displayNone))
                    this.MenuScanProgress.classList.remove(this.displayNone);
                break;
            default:
                Exception.Throw('Unexpected Page.', args);
        }
    }

    private OnGenresClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Finder,
            Detail: ContentDetails.Genres
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
    private OnArtistsClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Finder,
            Detail: ContentDetails.Artists
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
    private OnAlbumTracksClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Finder,
            Detail: ContentDetails.AlbumTracks
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
    private OnPlaylistsClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Playlists,
            Detail: ContentDetails.Playlists
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
    private OnPlaylistTracksClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Playlists,
            Detail: ContentDetails.PlaylistTracks
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
    private OnMopidyClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Settings,
            Detail: ContentDetails.SetMopidy
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
    private OnDbClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Settings,
            Detail: ContentDetails.Database
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
    private OnScanProgressClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Settings,
            Detail: ContentDetails.ScanProgress
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
    }
}
