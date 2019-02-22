import React from 'react';

export interface GitChangesAnalyserProps {
    changeLog: {[key:string]: string | boolean | number }
}

export const GitChangesAnalyser: React.FunctionComponent<GitChangesAnalyserProps> = function (props: GitChangesAnalyserProps){
    return (
        <div className='git-changes-analyser'>
            <pre style={{textAlign:'left'}}>{JSON.stringify(props.changeLog, null, 4)}</pre>
        </div>
    );
};
