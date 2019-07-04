import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import GenreList from './GenreList';
import ArtistList from './ArtistList';
import AlbumList from './AlbumList';

@Component({
    template: `<section class="content h-100">
    <div class="row">
        <genre-list ref="GenreList" />
        <artist-list ref="ArtistList" />
        <album-list ref="AlbumList" />
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

    public get ArtistList(): ArtistList {
        return this.$refs.ArtistList as ArtistList;
    }

    public get AlbumList(): AlbumList {
        return this.$refs.AlbumList as AlbumList;
    }
}
