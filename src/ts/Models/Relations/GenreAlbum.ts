export interface IGenreAlbum {
    GenreId: number;
    AlbumId: number;
}

export default class GenreAlbum implements IGenreAlbum {

    public static Create(entity: IGenreAlbum): GenreAlbum {
        if (!entity)
            return null;

        const result = new GenreAlbum();
        result.GenreId = entity.GenreId || null;
        result.AlbumId = entity.AlbumId || null;

        return result;
    }

    public static CreateArray(entities: IGenreAlbum[]): GenreAlbum[] {
        const result: GenreAlbum[] = [];
        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = GenreAlbum.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public GenreId: number = null;
    public AlbumId: number = null;
}
