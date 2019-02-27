import { default as React, useEffect, useState, useRef } from 'react';
import { makeViz } from './makeViz';
import './viz.css';

export interface VizProps {}

export const Viz: React.FunctionComponent<VizProps> = (props) => {
    const [initialized, setInitialized] = useState(false);
    const chart = useRef(null);

    useEffect(() => {
        initialized && makeViz(chart);
        setInitialized(true);
    });

    return <React.Fragment />;
};

