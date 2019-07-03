import ISelectionItem from '../Bases/ISelectionItem';
import Genre from '../Genres/Genre';
import Album from '../Albums/Album';
import Artist from '../Artists/Artist';

export default class Track implements ISelectionItem {
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
}
