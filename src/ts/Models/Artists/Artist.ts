import ArtistAlbum from '../Relations/ArtistAlbum';
import GenreArtist from '../Relations/GenreArtist';

export default class Artist {
    public Id: number;
    public Name: string;
    public Uri: string;
    public ArtistAlbums: ArtistAlbum[];
    public GenreArtists: GenreArtist[];
}
