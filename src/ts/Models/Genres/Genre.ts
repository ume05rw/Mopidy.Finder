import ISelectionItem from '../Bases/ISelectionItem';
import GenreArtist from '../Relations/GenreArtist';
import GenreAlbum from '../Relations/GenreAlbum';

export default class Genre implements ISelectionItem {
    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public GenreArtists: GenreArtist[];
    public GenreAlbums: GenreAlbum[];
}
