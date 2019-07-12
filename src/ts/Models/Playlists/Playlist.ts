import IRef from '../Mopidies/IRef';
import Track from '../Tracks/Track';

export default class Playlist {

    public static CreateByRef(entity: IRef): Playlist {
        if (!entity)
            return null;

        const result = new Playlist();
        result.Name = entity.name || null;
        result.Uri = entity.uri || null;
        result.Tracks = [];

        return result;
    }

    public static CreateArrayByRefs(entities: IRef[]): Playlist[] {
        const result: Playlist[] = [];

        for (let i = 0; i < entities.length; i++) {
            const entity = Playlist.CreateByRef(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Name: string = null;
    public Uri: string = null;
    public Tracks: Track[] = [];
}
