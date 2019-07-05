import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import GenreList from './Lists/GenreList';
import ArtistList from './Lists/ArtistList';
import AlbumList from './Lists/AlbumList';
import TrackList from './Lists/TrackList';

@Component({
    template: `<section class="content h-100">
    <div class="row">
        <genre-list ref="GenreList" />
        <artist-list ref="ArtistList" />
        <album-list ref="AlbumList" />
        <track-list ref="TrackList" />
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

    public get ArtistList(): ArtistList {
        return this.$refs.ArtistList as ArtistList;
    }

    public get AlbumList(): AlbumList {
        return this.$refs.AlbumList as AlbumList;
    }

    public get TrackList(): TrackList {
        return this.$refs.TrackList as TrackList;
    }
}
