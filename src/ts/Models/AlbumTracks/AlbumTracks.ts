import { default as Album, IAlbum } from '../Albums/Album';
import { default as Artist, IArtist } from '../Artists/Artist';
import { default as Track, ITrack } from '../Tracks/Track';

export interface IAlbumTracks {
    Album: IAlbum;
    Artists: IArtist[];
    Tracks: ITrack[];
}

export default class AlbumTracks implements IAlbumTracks {

    public static Create(entity: IAlbumTracks): AlbumTracks {
        if (!entity)
            return null;

        const result = new AlbumTracks();
        result.Album = Album.Create(entity.Album);
        result.Artists = Artist.CreateArray(entity.Artists);
        result.Tracks = Track.CreateArray(entity.Tracks);

        return result;
    }

    public static CreateArray(entities: IAlbumTracks[]): AlbumTracks[] {
        const result: AlbumTracks[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = AlbumTracks.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Album: Album = null;
    public Artists: Artist[] = [];
    public Tracks: Track[] = [];

    public GetArtistName(): string {
        if (this.Artists.length <= 0)
            return '';
        if (this.Artists.length === 1)
            return this.Artists[0].Name;

        return this.Artists[0].Name + ' and more...';
    }
}
