import { default as React, useEffect, useState, useRef } from 'react';
import { makeViz } from './makeViz';
import './viz.css';
import { LogClient, gitLogClient } from './GitLogClient';

export interface VizProps {
    gitLogClient: LogClient;
}

export enum VizState {
    "BRAND_NEW",
    "LOADED",
    "FAILED"
}

export const Viz: React.FunctionComponent<VizProps> = (props) => {
    const [vizState, setVizState] = useState(VizState.BRAND_NEW);
    const [gitLogData, setGitLogData] = useState(null);
    const chart = useRef(null);

    const onDataChange = (d: any) => {
        // console.log(d);
        //TODO: do something with the data!
    } 

    useEffect(() => {
        switch (vizState){
            case VizState.BRAND_NEW:
                props.gitLogClient.getLog().then((gl: any)=> {
                    setGitLogData(gl);
                    setVizState(VizState.LOADED);
                });
                break;
            case VizState.LOADED:
                makeViz(chart.current, gitLogData, onDataChange);//, gitLogData
                break;
            default:
                throw new Error('An error occurred loading git log data');
                return;    
        }
    });

    return <React.Fragment >
        <div ref={chart}>
            <div className="spinner-border" role="status" style={{width: '7rem', height: '7rem'}} >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    </React.Fragment>;
};