import * as _ from 'lodash';

export interface IGenreAlbum {
    GenreId: number;
    AlbumId: number;
}

export default class GenreAlbum implements IGenreAlbum {

    public static Create(entity: IGenreAlbum): GenreAlbum {
        var result = new GenreAlbum();
        result.GenreId = entity.GenreId;
        result.AlbumId = entity.AlbumId;

        return result;
    }

    public static CreateArray(entities: IGenreAlbum[]): GenreAlbum[] {
        var result: GenreAlbum[] = [];
        _.each(entities, (entity) => {
            result.push(GenreAlbum.Create(entity));
        });

        return result;
    }

    public GenreId: number;
    public AlbumId: number;
}
