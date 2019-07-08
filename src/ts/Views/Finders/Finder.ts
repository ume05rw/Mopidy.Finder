import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';
import { ISelectionChangedArgs } from '../Events/FinderEvents';
import AlbumList from './Lists/AlbumList';
import ArtistList from './Lists/ArtistList';
import GenreList from './Lists/GenreList';

@Component({
    template: `<section class="content h-100">
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
            ref="AlbumList" />
    </div>
</section>`,
    components: {
        'genre-list': GenreList,
        'artist-list': ArtistList,
        'album-list': AlbumList
    }
})
export default class Finder extends ViewBase {

    private get GenreList(): GenreList {
        return this.$refs.GenreList as GenreList;
    }

    private get ArtistList(): ArtistList {
        return this.$refs.ArtistList as ArtistList;
    }

    private get AlbumList(): AlbumList {
        return this.$refs.AlbumList as AlbumList;
    }

    private OnGenreSelectionChanged(args: ISelectionChangedArgs): void {
        console.log('Finder.OnGenreSelectionChanged');
        console.log(args);

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

    private OnArtistSelectionChanged(args: ISelectionChangedArgs): void {
        if (args.Selected) {
            this.AlbumList.AddFilterArtistId(args.Entity.Id);
        } else {
            this.AlbumList.RemoveFilterArtistId(args.Entity.Id);
        }
    }

    private OnArtistRefreshed(): void {
        this.AlbumList.RemoveFilterAllArtists();
    }

    private OnAlbumSelectionChanged(args: ISelectionChangedArgs): void {
        console.log('Finder.OnAlbumSelectionChanged');
        console.log(args);
    }

    private OnAlbumRefreshed(): void {
    }

    private OnTrackSelectionChanged(args: ISelectionChangedArgs): void {
        console.log('Finder.OnTrackSelectionChanged');
        console.log(args);
    }

    private OnTrackRefreshed(): void {

    }
}
