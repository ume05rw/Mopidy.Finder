import * as _ from 'lodash';
import { default as Album, IAlbum } from '../Albums/Album';
import { default as Artist, IArtist } from '../Artists/Artist';
import { default as Track, ITrack } from '../Tracks/Track'

export interface IAlbumTracks {
    Album: IAlbum;
    Artists: IArtist[];
    Tracks: ITrack[];
}

export default class AlbumTracks implements IAlbumTracks {

    public static Create(entity: IAlbumTracks): AlbumTracks {
        var result = new AlbumTracks();
        if (entity) {
            result.Album = Album.Create(entity.Album);
            result.Artists = Artist.CreateArray(entity.Artists);
            result.Tracks = Track.CreateArray(entity.Tracks);
        }

        return result;
    }

    public static CreateArray(entities: IAlbumTracks[]): AlbumTracks[] {
        var result: AlbumTracks[] = [];
        _.each(entities, (entity) => {
            result.push(AlbumTracks.Create(entity));
        });

        return result;
    }

    public Album: Album;
    public Artists: Artist[];
    public Tracks: Track[];

    public get Id(): number {
        return this.Album.Id;
    }
    public get Name(): string {
        return this.Album.Name;
    }
    public get LowerName(): string {
        return this.Album.LowerName;
    }
    public get Uri(): string {
        return this.Album.Uri;
    }

    public GetArtistName(): string {
        if (this.Artists.length <= 0)
            return '';
        if (this.Artists.length === 1)
            return this.Artists[0].Name;

        return this.Artists[0].Name + ' and more...';
    }
}
