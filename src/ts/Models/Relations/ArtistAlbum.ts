export interface IArtistAlbum {
    ArtistId: number;
    AlbumId: number;
}

export default class ArtistAlbum implements IArtistAlbum {

    public static Create(entity: IArtistAlbum): ArtistAlbum {
        if (!entity)
            return null;

        const result = new ArtistAlbum();
        result.ArtistId = entity.ArtistId || null;
        result.AlbumId = entity.AlbumId || null;
        
        return result;
    }

    public static CreateArray(entities: IArtistAlbum[]): ArtistAlbum[] {
        const result: ArtistAlbum[] = [];
        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = ArtistAlbum.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    private constructor() {
    }

    public ArtistId: number = null;
    public AlbumId: number = null;
}
