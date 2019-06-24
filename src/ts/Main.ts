import '../css/site.css';
import Song from './Models/Entities/Song';
import SongStore from './Models/Stores/SongStore';
import Libraries from './Libraries';

try {
    Libraries.es6Promise.polyfill();
    //console.log('Promise Polyfill OK.');
} catch (ex) {
    throw new Error('Promise Poliyfill Error!');
}

try {
    //console.log('TS Start');

    const song1 = new Song('01', 'new york, new york');
    const song2 = new Song(null, 'stranger in the night');

    const store = new SongStore();
    const result = store.GetAll().then((res) => {
        console.log('result ok?');
        console.log(res);
    });
    
    
    //console.log(song1);
    //console.log(song2);

    //const En = Libraries.Enumerable;

} catch (ex) {
    //console.log(ex);
}
