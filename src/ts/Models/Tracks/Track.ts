import { default as Album, IAlbum } from '../Albums/Album';
import { default as Artist, IArtist } from '../Artists/Artist';
import { default as MopidyTrack } from '../Mopidies/ITrack';

export interface ITrack {
    Id: number;
    Name: string;
    LowerName: string;
    Uri: string;
    TlId: number;
    DiscNo: number;
    TrackNo: number;
    Date: string;
    Comment: string;
    Length: number;
    BitRate: number;
    LastModified: number;
    Album: IAlbum;
    Artists: IArtist[];

    // JSONがアホほどでかくなるのでやめる
    //Genre: IGenre;
    //Composers: IArtist[];
    //Performers: IArtist[];
}

export default class Track implements ITrack {

    public static Create(entity: ITrack): Track {
        if (!entity)
            return null;

        const result = new Track();
        result.Id = entity.Id || null;
        result.Name = entity.Name || null;
        result.LowerName = entity.LowerName || null;
        result.Uri = entity.Uri || null;
        result.TlId = entity.TlId || null;
        result.DiscNo = entity.DiscNo || null;
        result.TrackNo = entity.TrackNo || null;
        result.Date = entity.Date || null;
        result.Comment = entity.Comment || null;
        result.Length = entity.Length || null;
        result.BitRate = entity.BitRate || null;
        result.LastModified = entity.LastModified || null;
        result.Album = Album.Create(entity.Album);
        result.Artists = Artist.CreateArray(entity.Artists);

        // JSONがアホほどでかくなるのでやめる
        //result.Genre = Genre.Create(entity.Genre);
        //result.Composers = Artist.CreateArray(entity.Composers);
        //result.Performers = Artist.CreateArray(entity.Performers);

        return result;
    }

    public static CreateFromMopidy(entity: MopidyTrack): Track {
        if (!entity)
            return null;

        const result = new Track();
        result.Id = null;
        result.Name = entity.name || null;
        result.LowerName = (entity.name)
            ? entity.name.toLowerCase()
            : null;
        result.Uri = entity.uri || null;
        result.TlId = null;
        result.DiscNo = entity.disc_no || null;
        result.TrackNo = entity.track_no || null;
        result.Date = entity.date || null;
        result.Comment = entity.comment || null;
        result.Length = entity.length || null;
        result.BitRate = entity.bitrate || null;
        result.LastModified = entity.last_modified || null;
        result.Album = Album.CreateFromMopidy(entity.album);
        result.Artists = Artist.CreateArrayFromMopidy(entity.artists);

        // JSONがアホほどでかくなるのでやめる
        //result.Genre = Genre.Create(entity.Genre);
        //result.Composers = Artist.CreateArray(entity.Composers);
        //result.Performers = Artist.CreateArray(entity.Performers);

        return result;
    }

    public static CreateArray(entities: ITrack[]): Track[] {
        const result: Track[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Track.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public static CreateArrayFromMopidy(entities: MopidyTrack[]): Track[] {
        const result: Track[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Track.CreateFromMopidy(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Id: number = null;
    public Name: string = null;
    public LowerName: string = null;
    public Uri: string = null;
    public TlId: number = null;
    public DiscNo: number = null;
    public TrackNo: number = null;
    public Date: string = null;
    public Comment: string = null;
    public Length: number = null;
    public BitRate: number = null;
    public LastModified: number = null;
    public Album: Album = null;
    public Artists: Artist[] = [];

    //public Genre: Genre;
    //public Composers: Artist[];
    //public Performers: Artist[];

    public GetTimeString(): string {
        if (!this.Length)
            return '';

        const minute = Math.floor(this.Length / 60000);
        const second = Math.floor((this.Length % 60000) / 1000);
        const minuteStr = ('00' + minute.toString()).slice(-2);
        const secondStr = ('00' + second.toString()).slice(-2);

        return minuteStr + ':' + secondStr;
    }

    public GetYear(): number {
        if (!this.Date || this.Date.length < 1)
            return null;

        return (4 < this.Date.length)
            ? parseInt(this.Date.substr(0, 4), 10)
            : parseInt(this.Date, 10);
    }

    public GetFormattedYearString(): string {
        const year = this.GetYear();

        return (!year)
            ? ''
            : '(' + year.toString() + ')';
    }

    public GetAlbumName(): string {
        return (this.Album && this.Album.Name)
            ? this.Album.Name
            : '';
    }

    public GetFormattedArtistName(): string {
        return (!this.Artists || this.Artists.length <= 0)
            ? '--'
            : (this.Artists.length === 1)
                ? this.Artists[0].Name
                : (this.Artists[0].Name + ' and more...');
    }
}
