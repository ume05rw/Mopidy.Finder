import IRef from '../Mopidies/IRef';
import Track from '../Tracks/Track';

export interface IUpdate {
    HasUpdate: boolean;
    UpdatedTracks: Track[];
    RemovedTracks: Track[];
    IsOrderChanged: boolean;
    IsNameChanged: boolean;
    NewName: string;
}

export default class Playlist {

    public static readonly MinNameLength: number = 1;
    public static readonly MaxNameLength: number = 40;

    public static CreateFromRef(entity: IRef): Playlist {
        if (!entity)
            return null;

        const result = new Playlist();
        result.Name = entity.name || null;
        result.Uri = entity.uri || null;
        result.Tracks = [];

        return result;
    }

    public static CreateArrayFromRefs(entities: IRef[]): Playlist[] {
        const result: Playlist[] = [];

        for (let i = 0; i < entities.length; i++) {
            const entity = Playlist.CreateFromRef(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Name: string = null;
    public Uri: string = null;
    public Tracks: Track[] = [];
}
