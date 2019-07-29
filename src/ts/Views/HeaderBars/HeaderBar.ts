import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';
import { IContentArgs, Contents } from '../Bases/IContent';
import Exception from '../../Utils/Exception';
import Libraries from '../../Libraries';
import { ContentDetails, IContentDetailArgs } from '../Bases/IContentDetail';
import * as AdminLte from 'admin-lte/dist/js/adminlte';
import { PushMenuEvents } from '../Events/AdminLteEvents';

export const HeaderBarEvents = {
    DetailOrdered: 'DetailOrdered',
    SideBarShown: 'SideBarShown',
    SideBarCollapsed: 'SideBarCollapsed'
};

@Component({
    template: `<nav class="main-header navbar navbar-expand border-bottom">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link"
                data-widget="pushmenu"
                href="javascript:void(0)"
                ref="MainMenuButton" >
                <i class="fa fa-bars" />
            </a>
        </li>
        <li class="nav-item">
            <h3>{{ title }}</h3>
        </li>
    </ul>
    <ul class="navbar-nav ml-auto nav-pills">
        <li class="nav-item d-lg-none"
            ref="MenuGenres">
            <a class="nav-link active"
                @click="OnGenresClicked" >
                <i class="fa fa-tags" />
            </a>
        </li>
        <li class="nav-item d-lg-none"
            ref="MenuArtists">
            <a class="nav-link"
                @click="OnArtistsClicked" >
                <i class="fa fa-users" />
            </a>
        </li>
        <li class="nav-item d-lg-none"
            ref="MenuAlbumTracks">
            <a class="nav-link"
                @click="OnAlbumTracksClicked" >
                <i class="fa fa-music" />
            </a>
        </li>
        <li class="nav-item d-lg-none"
            ref="MenuPlaylists">
            <a class="nav-link active"
                @click="OnPlaylistsClicked" >
                <i class="fa fa-list-ul" />
            </a>
        </li>
        <li class="nav-item d-lg-none"
            ref="MenuPlaylistTracks">
            <a class="nav-link"
                @click="OnPlaylistTracksClicked" >
                <i class="fa fa-music" />
            </a>
        </li>

        <li class="nav-item d-lg-none"
            ref="MenuMopidy">
            <a class="nav-link active"
                @click="OnMopidyClicked" >
                <i class="fa fa-wifi" />
            </a>
        </li>
        <li class="nav-item d-lg-none"
            ref="MenuDb">
            <a class="nav-link"
                @click="OnDbClicked" >
                <i class="fa fa-database" />
            </a>
        </li>
        <li class="nav-item d-lg-none"
            ref="MenuScanProgress">
            <a class="nav-link"
                @click="OnScanProgressClicked" >
                <i class="fa fa-rocket" />
            </a>
        </li>
        <li class="nav-item d-lg-none"
            ref="MenuThanks">
            <a class="nav-link"
                @click="OnThanksClicked" >
                <i class="fa fa-handshake-o" />
            </a>
        </li>
    </ul>
</nav>`
})
export default class HeaderBar extends ViewBase {
    private title: string = 'Mopidy.Finder';
    private currentContent: Contents = null;
    private readonly displayNone: string = 'd-none';
    private readonly active: string = 'active';
    private allButtons: HTMLElement[] = [];
    private finderButtons: HTMLElement[] = [];
    private playlistsButtons: HTMLElement[] = [];
    private settingsButtons: HTMLElement[] = [];

    private jqMainManuButton: JQuery;
    private mainMenuButton: AdminLte.PushMenu;

    private get MainMenuButton(): HTMLElement {
        return this.$refs.MainMenuButton as HTMLElement;
    }

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
    private get MenuThanks(): HTMLElement {
        return this.$refs.MenuThanks as HTMLElement
    }

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.allButtons.push(this.MenuGenres);
        this.allButtons.push(this.MenuArtists);
        this.allButtons.push(this.MenuAlbumTracks);
        this.allButtons.push(this.MenuPlaylists);
        this.allButtons.push(this.MenuPlaylistTracks);
        this.allButtons.push(this.MenuMopidy);
        this.allButtons.push(this.MenuDb);
        this.allButtons.push(this.MenuScanProgress);
        this.allButtons.push(this.MenuThanks);

        this.finderButtons.push(this.MenuGenres);
        this.finderButtons.push(this.MenuArtists);
        this.finderButtons.push(this.MenuAlbumTracks);
        this.playlistsButtons.push(this.MenuPlaylists);
        this.playlistsButtons.push(this.MenuPlaylistTracks);
        this.settingsButtons.push(this.MenuMopidy);
        this.settingsButtons.push(this.MenuDb);
        this.settingsButtons.push(this.MenuScanProgress);
        this.settingsButtons.push(this.MenuThanks);

        Libraries.SetTooltip(this.MenuGenres, 'Genres');
        Libraries.SetTooltip(this.MenuArtists, 'Artists');
        Libraries.SetTooltip(this.MenuAlbumTracks, 'Album Tracks');
        Libraries.SetTooltip(this.MenuPlaylists, 'Playlists');
        Libraries.SetTooltip(this.MenuPlaylistTracks, 'Playlist Tracks');
        Libraries.SetTooltip(this.MenuMopidy, 'Set Mopidy');
        Libraries.SetTooltip(this.MenuDb, 'Database');
        Libraries.SetTooltip(this.MenuScanProgress, 'Scan Progress');
        Libraries.SetTooltip(this.MenuThanks, 'Thanks');
        this.AllButtonToHide();

        this.jqMainManuButton = Libraries.$(this.MainMenuButton);
        this.mainMenuButton = new Libraries.AdminLte.PushMenu(this.jqMainManuButton);
        this.jqMainManuButton.on(PushMenuEvents.Shown, (): void => {
            this.$emit(HeaderBarEvents.SideBarShown);
        });
        this.jqMainManuButton.on(PushMenuEvents.Collapsed, (): void => {
            this.$emit(HeaderBarEvents.SideBarCollapsed);
        });

        return true;
    }

    private AllButtonToHide(): void {
        for (let i = 0; i < this.allButtons.length; i++)
            if (!this.allButtons[i].classList.contains(this.displayNone))
                this.allButtons[i].classList.add(this.displayNone);
    }

    public SetDetail(args: IContentDetailArgs): void {
        switch (args.Content) {
            case Contents.Finder:
                switch (args.Detail) {
                    case ContentDetails.Genres:
                        this.SetDetailActive(this.MenuGenres, this.finderButtons);
                        break;
                    case ContentDetails.Artists:
                        this.SetDetailActive(this.MenuArtists, this.finderButtons);
                        break;
                    case ContentDetails.AlbumTracks:
                        this.SetDetailActive(this.MenuAlbumTracks, this.finderButtons);
                        break;
                    default:
                        Exception.Throw('Unexpected ContentDetail.', args);
                }
                break;
            case Contents.Playlists:
                switch (args.Detail) {
                    case ContentDetails.Playlists:
                        this.SetDetailActive(this.MenuPlaylists, this.playlistsButtons);
                        break;
                    case ContentDetails.PlaylistTracks:
                        this.SetDetailActive(this.MenuPlaylistTracks, this.playlistsButtons);
                        break;
                    default:
                        Exception.Throw('Unexpected ContentDetail.', args);
                }
                break;
            case Contents.Settings:
                switch (args.Detail) {
                    case ContentDetails.SetMopidy:
                        this.SetDetailActive(this.MenuMopidy, this.settingsButtons);
                        break;
                    case ContentDetails.Database:
                        this.SetDetailActive(this.MenuDb, this.settingsButtons);
                        break;
                    case ContentDetails.ScanProgress:
                        this.SetDetailActive(this.MenuScanProgress, this.settingsButtons);
                        break;
                    case ContentDetails.Thanks:
                        this.SetDetailActive(this.MenuThanks, this.settingsButtons);
                        break;
                    default:
                        Exception.Throw('Unexpected ContentDetail.', args);
                }
                break;
            default:
                Exception.Throw('Unexpected Content.', args);
        }
    }

    private SetDetailActive(activeButton: HTMLElement, buttonGroup: HTMLElement[]): void {
        for (let i = 0; i < buttonGroup.length; i++) {
            const btn = buttonGroup[i];
            if (activeButton === btn)
                continue;
            const link = btn.children.item(0) as HTMLElement;
            if (link.classList.contains(this.active))
                link.classList.remove(this.active);
        }

        const activeLink = activeButton.children.item(0) as HTMLElement;
        if (!activeLink.classList.contains(this.active))
            activeLink.classList.add(this.active);
    }

    public SetHeader(args: IContentArgs): void {
        this.currentContent = args.Content;
        this.title = args.Content.toString();

        this.AllButtonToHide();

        switch (this.currentContent) {
            case Contents.Finder:
                this.MenuGenres.classList.remove(this.displayNone);
                this.MenuArtists.classList.remove(this.displayNone);
                this.MenuAlbumTracks.classList.remove(this.displayNone);

                break;
            case Contents.Playlists:
                this.MenuPlaylists.classList.remove(this.displayNone);
                this.MenuPlaylistTracks.classList.remove(this.displayNone);

                break;
            case Contents.Settings:
                this.MenuMopidy.classList.remove(this.displayNone);
                this.MenuDb.classList.remove(this.displayNone);
                this.MenuScanProgress.classList.remove(this.displayNone);
                this.MenuThanks.classList.remove(this.displayNone);

                break;
            default:
                Exception.Throw('Unexpected Content.', args);
        }
    }

    private OnGenresClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Finder,
            Detail: ContentDetails.Genres
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuGenres, this.finderButtons);
    }
    private OnArtistsClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Finder,
            Detail: ContentDetails.Artists
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuArtists, this.finderButtons);
    }
    private OnAlbumTracksClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Finder,
            Detail: ContentDetails.AlbumTracks
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuAlbumTracks, this.finderButtons);
    }
    private OnPlaylistsClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Playlists,
            Detail: ContentDetails.Playlists
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuPlaylists, this.playlistsButtons);
    }
    private OnPlaylistTracksClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Playlists,
            Detail: ContentDetails.PlaylistTracks
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuPlaylistTracks, this.playlistsButtons);
    }
    private OnMopidyClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Settings,
            Detail: ContentDetails.SetMopidy
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuMopidy, this.settingsButtons);
    }
    private OnDbClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Settings,
            Detail: ContentDetails.Database
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuDb, this.settingsButtons);
    }
    private OnScanProgressClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Settings,
            Detail: ContentDetails.ScanProgress
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuScanProgress, this.settingsButtons);
    }
    private OnThanksClicked(): void {
        const args: IContentDetailArgs = {
            Content: Contents.Settings,
            Detail: ContentDetails.Thanks
        };
        this.$emit(HeaderBarEvents.DetailOrdered, args);
        this.SetDetailActive(this.MenuThanks, this.settingsButtons);
    }

    public GetIsSideBarVisible(): boolean {
        return this.mainMenuButton.isShown();
    }

    public SetSideBarOpen(): void {
        if (!this.mainMenuButton.isShown())
            this.mainMenuButton.show();
    }

    public SetSideBarClose(): void {
        if (this.mainMenuButton.isShown())
            this.mainMenuButton.collapse();
    }
}
