import Component from 'vue-class-component';
import Artist from '../../Models/Artists/Artist';
import Genre from '../../Models/Genres/Genre';
import Delay from '../../Utils/Delay';
import Exception from '../../Utils/Exception';
import { default as IContentDetail, ContentDetails, IContentDetailArgs } from '../Bases/IContentDetail';
import ContentBase from '../Bases/ContentBase';
import { ISelectionChangedArgs } from '../Shared/SelectionItem';
import { AlbumListEvents, default as AlbumList } from './Lists/Albums/AlbumList';
import ArtistList from './Lists/ArtistList';
import GenreList from './Lists/GenreList';
import Dump from '../../Utils/Dump';
import * as _ from 'lodash';

export const FinderEvents = _.extend({}, AlbumListEvents);

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-finder"
                        role="tabpanel"
                        aria-labelledby="nav-finder">
    <div class="row">
        <genre-list
            ref="GenreList"
            @SelectionChanged="OnGenreSelectionChanged"
            @Refreshed="OnGenreRefreshed" />
        <artist-list
            ref="ArtistList"
            @SelectionChanged="OnArtistSelectionChanged"
            @Refreshed="OnArtistRefreshed" />
        <album-list
            ref="AlbumList"
            @PlaylistUpdated="OnPlaylistUpdated"/>
    </div>
</section>`,
    components: {
        'genre-list': GenreList,
        'artist-list': ArtistList,
        'album-list': AlbumList
    }
})
export default class Finder extends ContentBase {

    private get GenreList(): GenreList {
        return this.$refs.GenreList as GenreList;
    }

    private get ArtistList(): ArtistList {
        return this.$refs.ArtistList as ArtistList;
    }

    private get AlbumList(): AlbumList {
        return this.$refs.AlbumList as AlbumList;
    }

    public async Initialize(): Promise<boolean> {
        Dump.Log('Finder.Initialize: Start.');
        super.Initialize();

        this.details.push(this.GenreList);
        this.details.push(this.ArtistList);
        this.details.push(this.AlbumList);

        Dump.Log('Finder.Initialize: End.');
        return true;
    }

    // #region "IContentView"
    protected details: IContentDetail[] = [];
    public GetIsPermitLeave(): boolean {
        return true;
    }
    public InitContent(): void {
        this.AlbumList.InitPlaylistList();
        Delay.Wait(800)
            .then((): void => {
                this.GenreList.LoadIfEmpty();
                this.ArtistList.LoadIfEmpty();
                this.AlbumList.LoadIfEmpty();
            });
    }
    public ShowContentDetail(args: IContentDetailArgs): void {
        switch (args.Detail) {
            case ContentDetails.Genres:
                this.HideAllDetails();
                this.GenreList.Show();
                this.GenreList.LoadIfEmpty();
                break;
            case ContentDetails.Artists:
                this.HideAllDetails();
                this.ArtistList.Show();
                this.ArtistList.LoadIfEmpty();
                break;
            case ContentDetails.AlbumTracks:
                this.HideAllDetails();
                this.AlbumList.Show();
                this.AlbumList.LoadIfEmpty();
                break;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }
    }
    // #endregion

    private OnPlaylistUpdated(): void {
        this.$emit(FinderEvents.PlaylistUpdated);
    }

    private OnGenreSelectionChanged(args: ISelectionChangedArgs<Genre>): void {
        if (args.Selected) {
            this.ArtistList.AddFilterGenreId(args.Entity.Id);
            this.AlbumList.RemoveAllFilters();
            this.AlbumList.AddFilterGenreId(args.Entity.Id);
        } else {
            this.ArtistList.RemoveFilterGenreId(args.Entity.Id);
            this.AlbumList.RemoveAllFilters();
        }
    }

    private OnGenreRefreshed(): void {
        this.ArtistList.RemoveAllFilters();
        this.AlbumList.RemoveAllFilters();
    }

    private OnArtistSelectionChanged(args: ISelectionChangedArgs<Artist>): void {
        if (args.Selected) {
            this.AlbumList.AddFilterArtistId(args.Entity.Id);
        } else {
            this.AlbumList.RemoveFilterArtistId(args.Entity.Id);
        }
    }

    private OnArtistRefreshed(): void {
        this.AlbumList.RemoveFilterAllArtists();
    }

    public ForceRefresh(): void {
        this.GenreList.ForceRefresh();
        this.ArtistList.ForceRefresh();
        this.AlbumList.ForceRefresh();
    }

    public RefreshPlaylist(): void {
        this.AlbumList.InitPlaylistList();
    }
}
