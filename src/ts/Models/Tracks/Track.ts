import * as _ from 'lodash';
import ISelectionItem from '../Bases/ISelectionItem';
import { default as Genre, IGenre } from '../Genres/Genre';
import { default as Album, IAlbum } from '../Albums/Album';
import { default as Artist, IArtist } from '../Artists/Artist';

export interface ITrack {
    Name: string;
    Uri: string;
    TlId: number;
    DiscNo: number;
    TrackNo: number;
    Date: string;
    Comment: string;
    Length: number;
    BitRate: number;
    LastModified: number;
    Genre: IGenre;
    Album: IAlbum;
    Artists: IArtist[];
    Composers: IArtist[];
    Performaers: IArtist[];
}

export default class Track implements ITrack, ISelectionItem {

    public static Create(entity: ITrack): Track {
        var result = new Track();
        result.Name = entity.Name;
        result.Uri = entity.Uri;
        result.TlId = entity.TlId;
        result.DiscNo = entity.DiscNo;
        result.TrackNo = entity.TrackNo;
        result.Date = entity.Date;
        result.Comment = entity.Comment;
        result.Length = entity.Length;
        result.BitRate = entity.BitRate;
        result.LastModified = entity.LastModified;
        result.Genre = Genre.Create(entity.Genre);
        result.Album = Album.Create(entity.Album);
        result.Artists = Artist.CreateArray(entity.Artists);
        result.Composers = Artist.CreateArray(entity.Composers);
        result.Performaers = Artist.CreateArray(entity.Performaers);

        return result;
    }

    public static CreateArray(entities: ITrack[]): Track[] {
        var result: Track[] = [];
        _.each(entities, (entity) => {
            result.push(Track.Create(entity));
        });

        return result;
    }

    public Name: string;
    public Uri: string;
    public TlId: number;
    public DiscNo: number;
    public TrackNo: number;
    public Date: string;
    public Comment: string;
    public Length: number;
    public BitRate: number;
    public LastModified: number;
    public Genre: Genre;
    public Album: Album;
    public Artists: Artist[];
    public Composers: Artist[];
    public Performaers: Artist[];

    public get Id(): number {
        return this.TlId;
    }

    public get LowerName(): string {
        return this.Name.toLowerCase();
    }

    public GetTimeString(): string {
        console.log('Track.TimeString: Length = ' + this.Length);
        if (!this.Length) {
            return '';
        }

        const minute = ('00' + Math.floor(this.Length / 60000).toString()).slice(-2);
        const second = ('00' + Math.floor(this.Length % 60000).toString()).slice(-2);
        console.log('minute: ' + minute);
        console.log('second: ' + second);
        return minute + ':' + second;
    }
}
