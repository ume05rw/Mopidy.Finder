import * as _ from 'lodash';
import IRef from '../Mopidies/IRef';
import ITrack from '../Mopidies/ITrack';

export interface IPlaylist {
    Name: string;
    Uri: string;
    Tracks: ITrack[];
}

export default class Playlist {

    public static Create(entity: IPlaylist): Playlist {
        const result = new Playlist();
        if (entity) {
            result.Name = entity.Name;
            result.Uri = entity.Uri;
            result.Tracks = entity.Tracks;
        }

        return result;
    }

    public static CreateArray(entities: IPlaylist[]): Playlist[] {
        const result: Playlist[] = [];
        _.each(entities, (entity) => {
            result.push(Playlist.Create(entity));
        });

        return result;
    }

    public static CreateByRef(entity: IRef): Playlist {
        const result = new Playlist();
        if (entity) {
            result.Name = entity.name;
            result.Uri = entity.uri;
            result.Tracks = [];
        }

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
    public Tracks: ITrack[];
}
