import '../css/site.css';
import Libraries from './Libraries';
import ArtistStore from './Models/Stores/ArtistStore';
import GenreStore from './Models/Stores/GenreStore';
import AlbumStore from './Models/Stores/AlbumStore';


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

        // 最初にアルバム全件を取得する。
        await albums.Init();

        const promises: Promise<boolean>[] = [];
        promises.push(artists.Init(albums));
        promises.push(genres.Init(albums));
        

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
