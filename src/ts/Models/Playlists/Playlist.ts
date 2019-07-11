import * as _ from 'lodash';
import IRef from '../Mopidies/IRef';
import ITrack from '../Mopidies/ITrack';
import Track from '../Tracks/Track';

export interface IPlaylist {
    Name: string;
    Uri: string;
    MopidyTracks: ITrack[];
    Tracks: Track[];
}

export default class Playlist {

    public static Create(entity: IPlaylist): Playlist {
        if (!entity)
            return null;

        const result = new Playlist();
        result.Name = entity.Name;
        result.Uri = entity.Uri;
        result.MopidyTracks = entity.MopidyTracks;
        result.Tracks = entity.Tracks;

        return result;
    }

    public static CreateArray(entities: IPlaylist[]): Playlist[] {
        const result: Playlist[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Playlist.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public static CreateByRef(entity: IRef): Playlist {
        if (!entity)
            return null;

        const result = new Playlist();
        result.Name = entity.name;
        result.Uri = entity.uri;
        result.Tracks = [];
        result.MopidyTracks = [];

        return result;
    }

    public static CreateArrayByRefs(entities: IRef[]): Playlist[] {
        const result: Playlist[] = [];
        _.each(entities, (entity) => {
            result.push(Playlist.CreateByRef(entity));
        });

        return result;
    }

    public Name: string;
    public Uri: string;
    public MopidyTracks: ITrack[];
    public Tracks: Track[];
}
