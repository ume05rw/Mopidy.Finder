import '../css/site.css';
import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import 'vue2-admin-lte/src/lib/css';
import 'vue2-admin-lte/src/lib/script';
import Libraries from './Libraries';
import ArtistStore from './Models/Artists/ArtistStore';
import GenreStore from './Models/Genres/GenreStore';
import AlbumStore from './Models/Albums/AlbumStore';
import RootContoller from './Controllers/MainController';

class Main {

    private _rootController: RootContoller;

    public async Init(): Promise<boolean> {
        console.log('TS Start');

        this.PolyfillPromise();
        await this.InitStores();
        await this.InitControllers();

        return true;
    }

    private PolyfillPromise(): void {
        try {
            Libraries.es6Promise.polyfill();
            //console.log('Promise Polyfill OK.');
        } catch (ex) {
            throw new Error('Promise Poliyfill Error!');
        }
    }

    private async InitStores(): Promise<boolean> {
        
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

        return true;
    }

    private async InitControllers(): Promise<boolean> {

        this._rootController = new RootContoller();
        await this._rootController.Init();

        return true;
    }
}

const main = (new Main()).Init();
