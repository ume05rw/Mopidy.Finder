import Exception from '../../Utils/Exception';
import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import { default as AlbumTracks } from './AlbumTracks';

export interface IPagenateQueryArgs {
    GenreIds: number[];
    ArtistIds: number[];
    FilterText: string;
    Page: number;
}

export default class AlbumTracksStore extends StoreBase<AlbumTracks> {

    public async GetList(args: IPagenateQueryArgs): Promise<IPagenatedResult<AlbumTracks>> {
        const response = await this.QueryGet('AlbumTracks/GetPagenatedList', args);

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);
        
        const result = response.Result as IPagenatedResult<AlbumTracks>;
        result.ResultList = AlbumTracks.CreateArray(result.ResultList);

        return result;
    }
}
