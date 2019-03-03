import React from 'react';

export interface GitStatsProps {
    gitLogData: any
}

export const GitStats: React.FunctionComponent<GitStatsProps> = (props: GitStatsProps) => (
    <h1>Git Stats</h1>
);

export const filesPerCommitDate = (gitLogChangeData: any) => {
    return Object.entries(gitLogChangeData).reduce((acc: any, item: [string, any]) => {
        const [path, date] = item;
        (acc[date] ? acc[date].push(path): acc[date] = [path]);
        return acc;
    }, {});
};

export const calculate = (gitLogChangeData: any) => {
    const cpf = Object.entries( filesPerCommitDate(gitLogChangeData) );
    //     .reduce((acc: any, item: any) => {
    //     const [commitDate, files] = item;
    //     (acc.commits++);
    //     acc.commitFiles = item
    //     return acc;
    // }, {
    //     commitToFileRatio: 0,
    //     commits: 0,
    //     commitFiles: 0
    // });    

    return {
        commitToFileRatio: 10
    }
};