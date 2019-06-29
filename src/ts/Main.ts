import '../css/site.css';
import Libraries from './Libraries';
import ArtistStore from './Models/Artists/ArtistStore';
import GenreStore from './Models/Genres/GenreStore';
import AlbumStore from './Models/Albums/AlbumStore';

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

        let promises: Promise<boolean>[] = [];
        promises.push(albums.Init());
        promises.push(artists.Init());
        promises.push(genres.Init());
        await Promise.all(promises);

        console.log('Artists:');
        console.log(artists.GetAll());
        console.log('Genres:');
        console.log(genres.GetAll());
        console.log('Albums;');
        console.log(albums.GetAll());
    }
}

const main = (new Main()).Init();
