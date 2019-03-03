import React from 'react';

export interface GitStatsProps {
    gitLogData: any
}

export const GitStats: React.FunctionComponent<GitStatsProps> = (props: GitStatsProps) => (
    <h1>Git Stats</h1>
);

export const filesPerCommitDate = (gitLogChangeData: any) => {
    return Object.entries(gitLogChangeData).reduce((acc: any, item: [string, any]) => {
        const [path, dates] = item;
        dates.forEach((date: number) => {
            (acc[date] ? acc[date].push(path): acc[date] = [path]);
        });
        return acc;
    }, {});
};

export type GitStats = {
    commitsPerFile: number,
    commits: number,
    commitFiles: number
};

export const calculate = (gitLogChangeData: any) => {
    const cpf = Object.entries( filesPerCommitDate(gitLogChangeData) ).reduce((stats: GitStats, item: any) => {
        const [commitDate, files] = item;
        (stats.commits++);
        stats.commitFiles = stats.commitFiles + files.length;
        stats.commitsPerFile = stats.commits / stats.commitFiles;
        return stats;
    }, {
        commitsPerFile: 0,
        commits: 0,
        commitFiles: 0
    });    

    return cpf;
};