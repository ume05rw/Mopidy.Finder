import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import Genre from './Genre';

export default class GenreStore extends StoreBase<Genre> {

    public async GetList(page: number): Promise<IPagenatedResult<Genre>> {
        const response = await this.QueryGet('Genre/GetPagenatedList', {
            Page: page
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        var result = response.Result as IPagenatedResult<Genre>;
        result.ResultList = Genre.CreateArray(result.ResultList);

        return result;
    }
}
