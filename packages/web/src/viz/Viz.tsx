import React, { useEffect, useState, useRef } from 'react';
import { makeViz } from './makeViz';
import { LogClient } from './GitLogClient';
import { Breadcrumb } from './Breadcrumb';
import { GitStats, calculate, filter } from './GitStats';

import './viz.css';

export interface VizProps {
    gitLogClient: LogClient;
}

export enum VizState {
    'BRAND_NEW',
    'LOADED',
    'FAILED',
}

export const Viz: React.FunctionComponent<VizProps> = (props) => {
    const [vizState, setVizState] = useState(VizState.BRAND_NEW);
    const [gitLogData, setGitLogData] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState([] as string[]);
    const [gitStats, setGitStats] = useState({});
    const chart = useRef(null);

    const onDirectoryChange = (breadcrumb: any) => {
        const path = breadcrumb.join('/').replace(/^root\//, '');
        setBreadcrumb(breadcrumb);
        setGitStats(calculate(filter({ ...(gitLogData as any), ...{} }, path)));
    };

    useEffect(() => {
        switch (vizState) {
            case VizState.BRAND_NEW:
                props.gitLogClient.getLog().then((gl: any) => {
                    setGitLogData(gl);
                    setVizState(VizState.LOADED);
                });
                break;
            case VizState.LOADED:
                makeViz(chart.current, gitLogData, onDirectoryChange);
                break;
            default:
                throw new Error('An error occurred loading git log data');
                return;
        }
    }, [gitLogData]);

    return (
        <div>
            <div id="chartContainer" ref={chart}>
                <div
                    className="spinner-border"
                    role="status"
                    style={{ width: '7rem', height: '7rem' }}
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            <GitStats gitDirectoryStats={gitStats} />
            <Breadcrumb path={breadcrumb} />
        </div>
    );
};
