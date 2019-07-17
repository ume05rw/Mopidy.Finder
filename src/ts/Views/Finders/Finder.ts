import Component from 'vue-class-component';
import ContentViewBase from '../Bases/ContentViewBase';
import { ISelectionChangedArgs } from '../Shared/SelectionItem';
import AlbumList from './Lists/Albums/AlbumList';
import ArtistList from './Lists/ArtistList';
import GenreList from './Lists/GenreList';
import Genre from '../../Models/Genres/Genre';
import Artist from '../../Models/Artists/Artist';
import { SelectionAlbumEvents } from './Lists/Albums/SelectionAlbumTracks';

@Component({
    template: `<section class="content h-100 tab-pane fade show active"
                        id="tab-finder"
                        role="tabpanel"
                        aria-labelledby="finder-tab">
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
            @PlaylistCreated="OnPlaylistCreated"/>
    </div>
</section>`,
    components: {
        'genre-list': GenreList,
        'artist-list': ArtistList,
        'album-list': AlbumList
    }
})
export default class Finder extends ContentViewBase {

    private get GenreList(): GenreList {
        return this.$refs.GenreList as GenreList;
    }

    private get ArtistList(): ArtistList {
        return this.$refs.ArtistList as ArtistList;
    }

    private get AlbumList(): AlbumList {
        return this.$refs.AlbumList as AlbumList;
    }

    protected async OnShown(): Promise<boolean> {
        super.OnShown();

        await this.AlbumList.InitPlaylistList();

        return true;
    }

    private OnPlaylistCreated(): void {
        this.$emit(SelectionAlbumEvents.PlaylistCreated);
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

    public RefreshPlaylist(): void {
        this.AlbumList.InitPlaylistList();
    }

    public GetIsPermitLeave(): boolean {
        return true;
    }
}
