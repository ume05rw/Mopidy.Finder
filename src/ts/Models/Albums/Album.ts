import ISelectionItem from '../Bases/ISelectionItem';
import ArtistAlbum from '../Relations/ArtistAlbum';
import GenreAlbum from '../Relations/GenreAlbum';

export default class Album implements ISelectionItem {
    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public Year: number;
    public ArtistAlbums: ArtistAlbum[];
    public GenreAlbums: GenreAlbum[];
}
