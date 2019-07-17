export interface IGenreArtist {
    GenreId: number;
    ArtistId: number;
}

export default class GenreArtist implements IGenreArtist {

    public static Create(entity: IGenreArtist): GenreArtist {
        if (!entity)
            return null;

        const result = new GenreArtist();
        result.GenreId = entity.GenreId || null;
        result.ArtistId = entity.ArtistId || null;

        return result;
    }

    public static CreateArray(entities: IGenreArtist[]): GenreArtist[] {
        const result: GenreArtist[] = [];
        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = GenreArtist.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }


    private constructor() {
    }

    public GenreId: number = null;
    public ArtistId: number = null;
}
