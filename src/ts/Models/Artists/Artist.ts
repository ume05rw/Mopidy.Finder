import { default as MopidyArtist } from '../Mopidies/IArtist';
import { default as ArtistAlbum, IArtistAlbum } from '../Relations/ArtistAlbum';
import { default as GenreArtist, IGenreArtist } from '../Relations/GenreArtist';

export interface IArtist {
    Id: number;
    Name: string;
    LowerName: string;
    Uri: string;
    ImageUri: string;
    ArtistAlbums: IArtistAlbum[];
    GenreArtists: IGenreArtist[];
}

export default class Artist implements IArtist {

    public static Create(entity: IArtist): Artist {
        if (!entity)
            return null;

        const result = new Artist();
        result.Id = entity.Id || null;
        result.Name = entity.Name || null;
        result.LowerName = entity.LowerName || null;
        result.Uri = entity.Uri || null;
        result.ImageUri = entity.ImageUri || null;
        result.ArtistAlbums = ArtistAlbum.CreateArray(entity.ArtistAlbums);
        result.GenreArtists = GenreArtist.CreateArray(entity.GenreArtists);

        return result;
    }

    public static CreateFromMopidy(entity: MopidyArtist): Artist {
        if (!entity)
            return null;

        const result = new Artist();
        result.Id = null;
        result.Name = entity.name || null;
        result.LowerName = (entity.name)
            ? entity.name.toLowerCase()
            : null;
        result.Uri = entity.uri || null;
        result.ImageUri = null;
        result.ArtistAlbums = [];
        result.GenreArtists = [];

        return result;
    }

    public static CreateArray(entities: IArtist[]): Artist[] {
        const result: Artist[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Artist.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public static CreateArrayFromMopidy(entities: MopidyArtist[]): Artist[] {
        const result: Artist[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Artist.CreateFromMopidy(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Id: number = null;
    public Name: string = null;
    public LowerName: string = null;
    public Uri: string = null;
    public ImageUri: string = null;
    public ArtistAlbums: ArtistAlbum[] = [];
    public GenreArtists: GenreArtist[] = [];
}
