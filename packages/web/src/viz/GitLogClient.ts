export type logFetch = () => Promise<any>;
export interface LogClient {
    getLog: logFetch
}

export const gitLogClient = (): LogClient => ({
    getLog(): Promise<any>{
        // HACK: temporary solution
        return fetch('/git-changes.json').then((r: any) => r.json());
    }
}); 