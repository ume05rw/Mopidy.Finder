import * as _ from 'lodash';
import { default as Album, IAlbum } from '../Albums/Album';
import { default as Artist, IArtist } from '../Artists/Artist';
import { default as Track, ITrack } from '../Tracks/Track'
import ISelectionItem from '../Bases/ISelectionItem';

export interface IAlbumTracks {
    Album: IAlbum;
    Artist: IArtist;
    Tracks: ITrack[];
}

export default class AlbumTracks implements IAlbumTracks, ISelectionItem {

    public static Create(entity: IAlbumTracks): AlbumTracks {
        var result = new AlbumTracks();
        result.Album = Album.Create(entity.Album);
        result.Artist = Artist.Create(entity.Artist);
        result.Tracks = Track.CreateArray(entity.Tracks);

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
    public Artist: Artist;
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
}
