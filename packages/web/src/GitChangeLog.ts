import deepmerge from 'deepmerge';

export type GitChangeLogData = { [key:string]: string| number | boolean  };
export type GitChangeLogDataEntry = [ string, string | number | boolean ];

const toGraph = (gitChangeLog: GitChangeLogData) => () => {
    return Object.entries(gitChangeLog).reduce((acc: any[], entry: GitChangeLogDataEntry) => {
        const [path, count] = entry;
        return [
            ...acc, 
            {   
                path, 
                tree: GitChangeLog.splitPath(path),
                count
            }
            
        ];            
    }, []).reduce((a, intermediatePathObject) => {
        return deepmerge(
            a,
            (GitChangeLog.convertPathArrayToGraph(intermediatePathObject.tree, intermediatePathObject.count))
        );
    }, {});
}

export const GitChangeLog = (gitChangeLog: GitChangeLogData) => {
    return {
        toGraph: toGraph(gitChangeLog)  
    }
}

const splitPath = (path:string) => (path.split('/'));
GitChangeLog.splitPath = splitPath;

const convertPathArrayToGraph = (path: string[], count:number) => path.reduceRight((a:any, i:string, index: number) => {
    return index === path.length -1 ?  
            {[i]: count} : 
            ({ [i] : a });
}, {});
GitChangeLog.convertPathArrayToGraph = convertPathArrayToGraph;