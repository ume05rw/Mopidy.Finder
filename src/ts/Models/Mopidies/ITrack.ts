import IAlbum from './IAlbum';
import IArtist from './IArtist';

export default interface ITrack {
    uri: string;
    name: string;
    album: IAlbum;
    artists: IArtist[];
    composers: IArtist[];
    performers: IArtist[];
    
    genre: string;
    track_no: number;
    disc_no: number;
    date: string;
    length: number;
    bitrate: number;
    comment: string;
    musicbrainz_id: string;
    last_modified: number;
}
