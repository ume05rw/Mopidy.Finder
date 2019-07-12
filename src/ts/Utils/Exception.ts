export default class Exception {
    public static Throw(message: string, data?: any): void {
        throw new Error(Exception.CreateDump(message, data));
    }

    public static Dump(message: string, data?: any): void {
        console.error(Exception.CreateDump(message, data)); // eslint-disable-line
    }

    private static CreateDump(message: string, data?: any): string {
        if (!message)
            message = 'Unexpexted Error';

        return JSON.stringify({
            Message: message,
            Data: data
        });
    }
}
