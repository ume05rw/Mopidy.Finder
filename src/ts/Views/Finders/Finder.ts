import * as _ from 'lodash';
import Component from 'vue-class-component';
import Artist from '../../Models/Artists/Artist';
import Genre from '../../Models/Genres/Genre';
import Delay from '../../Utils/Delay';
import Exception from '../../Utils/Exception';
import ContentBase from '../Bases/ContentBase';
import { ContentDetails, default as IContentDetail, IContentDetailArgs, IContentSwipeArgs } from '../Bases/IContentDetail';
import { ISelectionChangedArgs } from '../Shared/SelectionItem';
import { AlbumListEvents, default as AlbumList } from './Lists/Albums/AlbumList';
import ArtistList from './Lists/ArtistList';
import GenreList from './Lists/GenreList';

export const FinderEvents = _.extend({}, AlbumListEvents);

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-finder"
                        role="tabpanel"
                        aria-labelledby="nav-finder">
    <div class="row"
        ref="DetailWrapper">
        <genre-list
            ref="GenreList"
            @SelectionChanged="OnGenreSelectionChanged"
            @Refreshed="OnGenreRefreshed"
            @Swiped="OnSwiped" />
        <artist-list
            ref="ArtistList"
            @SelectionChanged="OnArtistSelectionChanged"
            @Refreshed="OnArtistRefreshed"
            @Swiped="OnSwiped" />
        <album-list
            ref="AlbumList"
            @PlaylistUpdated="OnPlaylistUpdated"
            @Swiped="OnSwiped" />
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
        super.Initialize();

        this.details.push(this.GenreList);
        this.details.push(this.ArtistList);
        this.details.push(this.AlbumList);
        this.currentDetail = this.GenreList;
        this.detailWrapperElement = this.$refs.DetailWrapper as HTMLElement;

        return true;
    }

    // #region "IContentView"
    protected detailWrapperElement: HTMLElement = null;
    protected details: IContentDetail[] = [];
    protected currentDetail: IContentDetail = null;
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
    protected GetContentDetail(detail: ContentDetails): IContentDetail {
        switch (detail) {
            case ContentDetails.Genres:
                return this.GenreList;
            case ContentDetails.Artists:
                return this.ArtistList;
            case ContentDetails.AlbumTracks:
                return this.AlbumList;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }
    }
    public async ShowContentDetail(args: IContentDetailArgs): Promise<boolean> {
        await super.ShowContentDetail(args);

        switch (args.Detail) {
            case ContentDetails.Genres:
                this.GenreList.LoadIfEmpty();
                break;
            case ContentDetails.Artists:
                this.ArtistList.LoadIfEmpty();
                break;
            case ContentDetails.AlbumTracks:
                this.AlbumList.LoadIfEmpty();
                break;
            default:
                Exception.Throw('Unexpected ContentDetail');
        }

        return true;
    }
    protected OnSwiped(args: IContentSwipeArgs): void {
        super.OnSwiped(args);
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
