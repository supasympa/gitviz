import deepmerge from 'deepmerge';

export type GitChangeLogData = { [key:string]: number[] | string | number | boolean  };
export type GitChangeLogDataEntry = [ string, number[] | string | number | boolean ];

const toGraph = (gitChangeLog: GitChangeLogData) => () => {
    return Object.entries(gitChangeLog).reduce((acc: any[], entry: GitChangeLogDataEntry) => {
        const [path, changes] = entry;
        return [
            ...acc, 
            {   
                path, 
                tree: GitChangeLog.splitPath(path),
                changesArray: changes
            }
            
        ];            
    }, []).reduce((a, intermediatePathObject) => {
        return deepmerge(
            a,
            (GitChangeLog.convertPathArrayToGraph(intermediatePathObject.tree, intermediatePathObject.changesArray))
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

const convertPathArrayToGraph = (path: string[], changes: number[]) => path.reduceRight((a:any, i:string, index: number) => {
    return index === path.length -1 ?  
            {[i]: changes.length} : 
            ({ [i] : a });
}, {});

GitChangeLog.convertPathArrayToGraph = convertPathArrayToGraph;