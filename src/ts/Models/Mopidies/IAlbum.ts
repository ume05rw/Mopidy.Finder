import IArtist from './IArtist';

export default interface IAlbum {
    uri: string;
    name: string;
    artists: IArtist[];
    num_tracks: number;
    num_discs: number;
    date: string;
    musicbrainz_id: string;
    images: string[];
}
