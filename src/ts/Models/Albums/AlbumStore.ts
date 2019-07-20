import StoreBase from '../Bases/StoreBase';
import Album from './Album';
import Exception from '../../Utils/Exception';

export default class AlbumStore extends StoreBase<Album> {

    public async Exists(): Promise<boolean> {
        const response = await this.QueryGet('Album/Exists');

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        return response.Result as boolean;
    }
}
