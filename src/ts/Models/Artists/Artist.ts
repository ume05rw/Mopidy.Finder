import * as _ from 'lodash';
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
        var result = new Artist();
        if (entity) {
            result.Id = entity.Id;
            result.Name = entity.Name;
            result.LowerName = entity.LowerName;
            result.Uri = entity.Uri;
            result.ImageUri = entity.ImageUri;
            result.ArtistAlbums = ArtistAlbum.CreateArray(entity.ArtistAlbums);
            result.GenreArtists = GenreArtist.CreateArray(entity.GenreArtists);
        }

        return result;
    }

    public static CreateArray(entities: IArtist[]): Artist[] {
        var result: Artist[] = [];
        _.each(entities, (entity) => {
            result.push(Artist.Create(entity));
        });

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
