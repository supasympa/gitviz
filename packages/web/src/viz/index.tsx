import { default as React, useEffect, useState, useRef } from 'react';
import { makeViz } from './makeViz';
import './viz.css';

export interface VizProps {
    data: any;
}

export const Viz: React.FunctionComponent<VizProps> = (props) => {
    const [initialized, setInitialized] = useState(false);
    const chart = useRef(null);

    useEffect(() => {
        initialized && makeViz(chart, props.data);
        setInitialized(true);
    });

    return <React.Fragment />;
};

