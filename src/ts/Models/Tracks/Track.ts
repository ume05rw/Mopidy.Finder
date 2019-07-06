import * as _ from 'lodash';
import ISelectionItem from '../Bases/ISelectionItem';

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

    // JSONがアホほどでかくなるのでやめる
    //Genre: IGenre;
    //Album: IAlbum;
    //Artists: IArtist[];
    //Composers: IArtist[];
    //Performaers: IArtist[];
}

export default class Track implements ITrack, ISelectionItem {

    public static Create(entity: ITrack): Track {
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

        // JSONがアホほどでかくなるのでやめる
        //result.Genre = Genre.Create(entity.Genre);
        //result.Album = Album.Create(entity.Album);
        //result.Artists = Artist.CreateArray(entity.Artists);
        //result.Composers = Artist.CreateArray(entity.Composers);
        //result.Performaers = Artist.CreateArray(entity.Performaers);

        return result;
    }

    public static CreateArray(entities: ITrack[]): Track[] {
        var result: Track[] = [];
        _.each(entities, (entity) => {
            result.push(Track.Create(entity));
        });

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
