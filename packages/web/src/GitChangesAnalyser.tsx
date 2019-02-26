import React from 'react';
import { GitChangeLogData, GitChangeLog } from './GitChangeLog';
import { Viz } from './viz';

export interface GitChangesAnalyserProps {
    changeLog: GitChangeLogData
}

export const GitChangesAnalyser: React.FunctionComponent<GitChangesAnalyserProps> = function (props: GitChangesAnalyserProps){
    return (
        <div className='git-changes-analyser'>
            <Viz data={props.changeLog} />
            {/* <pre style={{textAlign:'left'}}>{JSON.stringify(props.changeLog, null, 4)}</pre> */}
        </div>
    );
};

