import * as _ from 'lodash';
import { default as GenreArtist, IGenreArtist } from '../Relations/GenreArtist';
import { default as GenreAlbum, IGenreAlbum } from '../Relations/GenreAlbum';

export interface IGenre {
    Id: number;
    Name: string;
    LowerName: string;
    Uri: string;
    GenreArtists: IGenreArtist[];
    GenreAlbums: IGenreAlbum[];
}

export default class Genre implements IGenre {

    public static Create(entity: IGenre): Genre {
        const result = new Genre();
        if (entity) {
            result.Id = entity.Id;
            result.Name = entity.Name;
            result.LowerName = entity.LowerName;
            result.Uri = entity.Uri;
            result.GenreArtists = GenreArtist.CreateArray(entity.GenreArtists);
            result.GenreAlbums = GenreAlbum.CreateArray(entity.GenreAlbums);
        }

        return result;
    }

    public static CreateArray(entities: IGenre[]): Genre[] {
        const result: Genre[] = [];
        _.each(entities, (entity) => {
            result.push(Genre.Create(entity));
        });

        return result;
    }

    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public GenreArtists: GenreArtist[];
    public GenreAlbums: GenreAlbum[];
}
