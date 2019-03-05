import React from 'react';

export interface GitStatsProps {
    gitDirectoryStats: any
}

export const GitStats: React.FunctionComponent<GitStatsProps> = (props: GitStatsProps) => {
    if(!props.gitDirectoryStats){
        return null;
    }
    
    return (
        <table className="table table-light">
            <thead>
                <tr>
                    <td>Key</td><td>Value</td>
                </tr>
            </thead>
            <tbody>
                <tr><td>Avg. commits per file</td><td>{props.gitDirectoryStats.averageCommitsPerFile}</td></tr>
            </tbody>
        </table>
    );
};

export const getCommits = (gitLogChangeData: any) => {
    return Object.entries(gitLogChangeData).reduce((acc: any, item: [string, any]) => {
        let [filePath, commitDateList] = item;

        commitDateList.forEach((commit: number) => {
            (acc[commit] ? acc[commit].push(filePath): acc[commit] = [filePath]);
        });
        return acc;
    }, {});
};

export type GitStats = {
    averageCommitsPerFile: number,
    commits: number,
    committedFiles: number
};

export const calculate = (gitLogChangeData: any) => {
    let allCommits: any = [];
    const commits = getCommits(gitLogChangeData);
    const cpf = Object.entries( commits ).reduce((stats: GitStats, item: any) => {
        const [commitDate, files] = item;
        // @ts-ignore
        allCommits = [...new Set([...allCommits, ...files])];
        (stats.commits++);
        stats.committedFiles = allCommits.length;
        stats.averageCommitsPerFile = stats.commits / stats.committedFiles; 
        return stats;
    }, {
        averageCommitsPerFile: 0,
        commits: 0,
        committedFiles: 0
    });    

    return cpf;
};

export const filter = (gitLogChangeData: any, filePath: string) => {
    return Object.entries(gitLogChangeData)
        .filter((entries:any) => entries[0].startsWith(filePath))
        .reduce((acc:any, item: any) => {
            acc[item[0]] = item[1];
            return acc;
        }, {})
}