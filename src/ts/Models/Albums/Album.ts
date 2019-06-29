import ArtistAlbum from '../Relations/ArtistAlbum';
import GenreAlbum from '../Relations/GenreAlbum';

export default class Album {
    public Id: number;
    public Name: string;
    public Uri: string;
    public ArtistAlbums: ArtistAlbum[];
    public GenreAlbums: GenreAlbum[];
}
