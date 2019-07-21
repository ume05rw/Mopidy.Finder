
export default class Dump {
    public static Log(message: string, value?: any): void {
        const time = Dump.GetTimestamp();
        console.log(`[${time.TimeStamp}]:: ` + message); // eslint-disable-line
        if (value)
            console.log(Dump.GetDumpString(value)); // eslint-disable-line
    }
    public static Warning(message: string, value?: any): void {
        const time = Dump.GetTimestamp();
        console.warn(`[${time.TimeStamp}]:: ` + message); // eslint-disable-line
        if (value)
            console.log(Dump.GetDumpString(value)); // eslint-disable-line
    }
    public static Error(message: string, value?: any): void {
        const dumpString = Dump.GetDumpString(value);
        const time = Dump.GetTimestamp();
        console.error(`[${time.TimeStamp}]:: ` + message); // eslint-disable-line
        if (value)
            console.log(Dump.GetDumpString(value)); // eslint-disable-line
    }

    private static GetDumpString(value: any): string {
        const type = typeof value;
        return (type === 'object' || type === 'function' || type === 'symbol')
            ? JSON.stringify(value, null, 4)
            : ('' + value);
    }

    private static GetTimestamp(): { Time: Date, TimeStamp: string } {
        const now = new Date();
        return {
            Time: now,
            TimeStamp: `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}.${('000' + now.getMilliseconds()).substr(-3)}`
        };
    }
}
