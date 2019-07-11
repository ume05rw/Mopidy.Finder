import IRef from '../Mopidies/IRef';
import ITrack from '../Mopidies/ITrack';
import Track from '../Tracks/Track';

export interface IPlaylist {
    Name: string;
    Uri: string;
    Tracks: Track[];
}

export default class Playlist {

    public static CreateByRef(entity: IRef): Playlist {
        if (!entity)
            return null;

        const result = new Playlist();
        result.Name = entity.name;
        result.Uri = entity.uri;
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

    public Name: string;
    public Uri: string;
    public Tracks: Track[];
}
