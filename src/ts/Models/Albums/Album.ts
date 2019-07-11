import { default as MopidyAlbum } from '../Mopidies/IAlbum';
import { default as ArtistAlbum, IArtistAlbum } from '../Relations/ArtistAlbum';
import { default as GenreAlbum, IGenreAlbum } from '../Relations/GenreAlbum';

export interface IAlbum {
    Id: number;
    Name: string;
    LowerName: string;
    Uri: string;
    Year: number;
    ImageUri: string;
    ArtistAlbums: IArtistAlbum[];
    GenreAlbums: IGenreAlbum[];
}

export default class Album implements IAlbum {

    public static Create(entity: IAlbum): Album {
        if (!entity)
            return null;

        var result = new Album();
        result.Id = entity.Id;
        result.Name = entity.Name;
        result.LowerName = entity.LowerName;
        result.Uri = entity.Uri;
        result.Year = entity.Year;
        result.ImageUri = entity.ImageUri;
        result.ArtistAlbums = ArtistAlbum.CreateArray(entity.ArtistAlbums);
        result.GenreAlbums = GenreAlbum.CreateArray(entity.GenreAlbums);

        return result;
    }

    public static CreateFromMopidy(entity: MopidyAlbum): Album {
        if (!entity)
            return null;

        var result = new Album();
        result.Id = null;
        result.Name = entity.name;
        result.LowerName = (entity.name)
            ? entity.name.toLowerCase()
            : null;
        result.Uri = entity.uri;
        result.Year = (entity.date && 4 <= entity.date.length)
            ? (4 < entity.date.length)
                ? parseInt(entity.date.substr(0, 4), 10)
                : parseInt(entity.date)
            : null;
        result.ImageUri = (entity.images && entity.images[0])
            ? entity.images[0]
            : null;
        result.ArtistAlbums = [];
        result.GenreAlbums = [];

        return result;
    }

    public static CreateArray(entities: IAlbum[]): Album[] {
        var result: Album[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Album.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public static CreateArrayFromMopidy(entities: MopidyAlbum[]): Album[] {
        var result: Album[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Album.CreateFromMopidy(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public Year: number;
    public ImageUri: string;
    public ArtistAlbums: ArtistAlbum[];
    public GenreAlbums: GenreAlbum[];

    public GetImageFullUri(): string {
        return `${location.protocol}//${location.host}${this.ImageUri}`;
    }
}
