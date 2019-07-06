import * as _ from 'lodash';
import ISelectionItem from '../Bases/ISelectionItem';
import { default as ArtistAlbum, IArtistAlbum } from '../Relations/ArtistAlbum';
import { default as GenreAlbum, IGenreAlbum } from '../Relations/GenreAlbum';

export interface IAlbum {
    Id: number;
    Name: string;
    LowerName: string;
    Uri: string;
    Year: number;
    ImageUri: string;
    ArtistAlbums: IArtistAlbum[];
    GenreAlbums: IGenreAlbum[];
}

export default class Album implements IAlbum, ISelectionItem {

    public static Create(entity: IAlbum): Album {
        var result = new Album();
        result.Id = entity.Id;
        result.Name = entity.Name;
        result.LowerName = entity.LowerName;
        result.Uri = entity.Uri;
        result.Year = entity.Year;
        result.ImageUri = entity.ImageUri;
        result.ArtistAlbums = ArtistAlbum.CreateArray(entity.ArtistAlbums);
        result.GenreAlbums = GenreAlbum.CreateArray(entity.GenreAlbums);

        return result;
    }

    public static CreateArray(entities: IAlbum[]): Album[] {
        var result: Album[] = [];
        _.each(entities, (entity) => {
            result.push(Album.Create(entity));
        });

        return result;
    }

    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public Year: number;
    public ImageUri: string;
    public ArtistAlbums: ArtistAlbum[];
    public GenreAlbums: GenreAlbum[];
}
