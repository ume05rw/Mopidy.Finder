import '../css/site.css';
import Libraries from './Libraries';
import ArtistStore from './Models/Stores/ArtistStore';
import GenreStore from './Models/Stores/GenreStore';
import AlbumStore from './Models/Stores/AlbumStore';
import ArtistAlbumStore from './Models/Stores/ArtistAlbumStore';
import GenreAlbumStore from './Models/Stores/GenreAlbumStore';

class Main {
    public Init(): void {
        console.log('TS Start');

        this.PolyfillPromise();
        this.InitStores();
    }

    private PolyfillPromise(): void {
        try {
            Libraries.es6Promise.polyfill();
            //console.log('Promise Polyfill OK.');
        } catch (ex) {
            throw new Error('Promise Poliyfill Error!');
        }
    }

    private async InitStores() {
        
        const artists = new ArtistStore();
        const genres = new GenreStore();
        const albums = new AlbumStore();
        const artistAlbums = new ArtistAlbumStore();
        const genreAlbums = new GenreAlbumStore();

        let promises: Promise<boolean>[] = [];
        promises.push(albums.Init());
        promises.push(artists.Init());
        promises.push(genres.Init());
        await Promise.all(promises);

        promises = [];
        promises.push(artistAlbums.Init(artists, albums));
        promises.push(genreAlbums.Init(genres, albums));
        await Promise.all(promises);

        console.log('Artists:');
        console.log(artists.GetAll());
        console.log('Genres:');
        console.log(genres.GetAll());
        console.log('Albums;');
        console.log(albums.GetAll());
        console.log('ArtistAlbums:')
        console.log(artistAlbums.GetAll());
        console.log('GenreAlbums;');
        console.log(genreAlbums.GetAll());
    }
}

const main = (new Main()).Init();
