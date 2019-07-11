import { default as GenreAlbum, IGenreAlbum } from '../Relations/GenreAlbum';
import { default as GenreArtist, IGenreArtist } from '../Relations/GenreArtist';

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
        if (!entity)
            return null;

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

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Genre.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public GenreArtists: GenreArtist[];
    public GenreAlbums: GenreAlbum[];
}
