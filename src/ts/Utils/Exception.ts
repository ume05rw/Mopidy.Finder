export default class Exception {
    public static Throw(message: string, data?: any): void {
        if (!message)
            message = 'Unexpexted Error';

        throw new Error(JSON.stringify({
            Message: message,
            Data: data
        }));
    }
}
