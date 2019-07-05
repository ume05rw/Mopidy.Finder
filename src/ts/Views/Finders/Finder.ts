import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import GenreList from './Lists/GenreList';
import ArtistList from './Lists/ArtistList';
import AlbumList from './Lists/AlbumList';
import TrackList from './Lists/TrackList';
import { Events, ISelectionChangedArgs } from '../Events/ListEvents';

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
            ref="AlbumList"
            @SelectionChanged="OnAlbumSelectionChanged"
            @Refreshed="OnAlbumRefreshed" />
        <track-list
            ref="TrackList"
            @SelectionChanged="OnTrackSelectionChanged"
            @Refreshed="OnTrackRefreshed" />
    </div>
</section>`,
    components: {
        'genre-list': GenreList,
        'artist-list': ArtistList,
        'album-list': AlbumList,
        'track-list': TrackList
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

    private get TrackList(): TrackList {
        return this.$refs.TrackList as TrackList;
    }

    private OnGenreSelectionChanged(args: ISelectionChangedArgs): void {
        console.log('Finder.OnGenreSelectionChanged');
        console.log(args);

        if (args.selected) {
            this.ArtistList.AddFilterGenreId(args.entity.Id);
            this.AlbumList.AddFilterGenreId(args.entity.Id);
        } else {
            this.ArtistList.RemoveFilterGenreId(args.entity.Id);
            this.AlbumList.RemoveFilterGenreId(args.entity.Id);
        }
    }

    private OnGenreRefreshed(): void {
        this.ArtistList.RemoveAllFilters();
        this.AlbumList.RemoveAllFilters();
    }

    private OnArtistSelectionChanged(args: ISelectionChangedArgs): void {
        console.log('Finder.OnArtistSelectionChanged');
        console.log(args);

        if (args.selected) {
            this.AlbumList.AddFilterArtistId(args.entity.Id);
        } else {
            this.AlbumList.RemoveFilterArtistId(args.entity.Id);
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
