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

        var result = new Track();
        result.Id = entity.Id;
        result.Name = entity.Name;
        result.LowerName = entity.LowerName;
        result.Uri = entity.Uri;
        result.TlId = entity.TlId;
        result.DiscNo = entity.DiscNo;
        result.TrackNo = entity.TrackNo;
        result.Date = entity.Date;
        result.Comment = entity.Comment;
        result.Length = entity.Length;
        result.BitRate = entity.BitRate;
        result.LastModified = entity.LastModified;
        result.Album = Album.Create(entity.Album);
        result.Artists = Artist.CreateArray(entity.Artists);

        // JSONがアホほどでかくなるのでやめる
        //result.Genre = Genre.Create(entity.Genre);
        //result.Composers = Artist.CreateArray(entity.Composers);
        //result.Performers = Artist.CreateArray(entity.Performers);

        return result;
    }

    public static CreateByMopidy(entity: MopidyTrack): Track {
        if (!entity)
            return null;

        var result = new Track();
        result.Id = null;
        result.Name = entity.name;
        result.LowerName = (entity.name)
            ? entity.name.toLowerCase()
            : null;
        result.Uri = entity.uri;
        result.TlId = null;
        result.DiscNo = entity.disc_no;
        result.TrackNo = entity.track_no;
        result.Date = entity.date;
        result.Comment = entity.comment;
        result.Length = entity.length;
        result.BitRate = entity.bitrate;
        result.LastModified = entity.last_modified;
        result.Album = Album.CreateByMopidy(entity.album);
        result.Artists = Artist.CreateArrayByMopidy(entity.artists);

        // JSONがアホほどでかくなるのでやめる
        //result.Genre = Genre.Create(entity.Genre);
        //result.Composers = Artist.CreateArray(entity.Composers);
        //result.Performers = Artist.CreateArray(entity.Performers);

        return result;
    }

    public static CreateArray(entities: ITrack[]): Track[] {
        var result: Track[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Track.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public static CreateArrayByMopidy(entities: MopidyTrack[]): Track[] {
        var result: Track[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Track.CreateByMopidy(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public TlId: number;
    public DiscNo: number;
    public TrackNo: number;
    public Date: string;
    public Comment: string;
    public Length: number;
    public BitRate: number;
    public LastModified: number;
    public Album: Album;
    public Artists: Artist[];

    //public Genre: Genre;
    //public Composers: Artist[];
    //public Performers: Artist[];

    public GetTimeString(): string {
        if (!this.Length) {
            return '';
        }

        const minute = Math.floor(this.Length / 60000);
        const second = Math.floor((this.Length % 60000) / 1000);
        const minuteStr = ('00' + minute.toString()).slice(-2);
        const secondStr = ('00' + second.toString()).slice(-2);
        return minuteStr + ':' + secondStr;
    }

    public GetYear(): number {
        if (!this.Date || this.Date.length < 4)
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
