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

        var result = new Artist();
        result.Id = entity.Id;
        result.Name = entity.Name;
        result.LowerName = entity.LowerName;
        result.Uri = entity.Uri;
        result.ImageUri = entity.ImageUri;
        result.ArtistAlbums = ArtistAlbum.CreateArray(entity.ArtistAlbums);
        result.GenreArtists = GenreArtist.CreateArray(entity.GenreArtists);

        return result;
    }

    public static CreateByMopidy(entity: MopidyArtist): Artist {
        if (!entity)
            return null;

        var result = new Artist();
        result.Id = null;
        result.Name = entity.name;
        result.LowerName = (entity.name)
            ? entity.name.toLowerCase()
            : null;
        result.Uri = entity.uri;
        result.ImageUri = null;
        result.ArtistAlbums = [];
        result.GenreArtists = [];

        return result;
    }

    public static CreateArray(entities: IArtist[]): Artist[] {
        var result: Artist[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Artist.Create(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public static CreateArrayByMopidy(entities: MopidyArtist[]): Artist[] {
        var result: Artist[] = [];

        if (!entities)
            return result;

        for (let i = 0; i < entities.length; i++) {
            const entity = Artist.CreateByMopidy(entities[i]);
            if (entity)
                result.push(entity);
        }

        return result;
    }

    public Id: number;
    public Name: string;
    public LowerName: string;
    public Uri: string;
    public ImageUri: string;
    public ArtistAlbums: ArtistAlbum[];
    public GenreArtists: GenreArtist[];
}
