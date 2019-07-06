import * as _ from 'lodash';

export interface IGenreArtist {
    GenreId: number;
    ArtistId: number;
}

export default class GenreArtist implements IGenreArtist {

    public static Create(entity: IGenreArtist): GenreArtist {
        var result = new GenreArtist();
        result.GenreId = entity.GenreId;
        result.ArtistId = entity.ArtistId;

        return result;
    }

    public static CreateArray(entities: IGenreArtist[]): GenreArtist[] {
        var result: GenreArtist[] = [];
        _.each(entities, (entity) => {
            result.push(GenreArtist.Create(entity));
        });

        return result;
    }

    public GenreId: number;
    public ArtistId: number;
}
