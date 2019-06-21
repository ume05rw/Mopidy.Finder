import Song from './Models/Entities/Song';

try {
    //console.log('TS Start');

    const song1 = new Song('01', 'new york, new york');
    const song2 = new Song(null, 'stranger in the night');

    //console.log(song1);
    //console.log(song2);

} catch (ex) {
    //console.log(ex);
}
