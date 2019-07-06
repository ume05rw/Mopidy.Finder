import * as _ from 'lodash';

export interface IArtistAlbum {
    ArtistId: number;
    AlbumId: number;
}

export default class ArtistAlbum implements IArtistAlbum {

    public static Create(entity: IArtistAlbum): ArtistAlbum {
        var result = new ArtistAlbum();
        result.ArtistId = entity.ArtistId;
        result.AlbumId = entity.AlbumId;
        
        return result;
    }

    public static CreateArray(entities: IArtistAlbum[]): ArtistAlbum[] {
        var result: ArtistAlbum[] = [];
        _.each(entities, (entity) => {
            result.push(ArtistAlbum.Create(entity));
        });

        return result;
    }

    public ArtistId: number;
    public AlbumId: number;
}
